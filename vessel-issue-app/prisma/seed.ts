import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@maritime.com" },
    update: {},
    create: {
      email: "admin@maritime.com",
      passwordHash: await hashPassword("admin123"),
      role: "ADMIN",
      assignedVesselIds: "[]",
    },
  });

  // Create 5 crew members
  const crewMembers = [
    {
      email: "john.smith@maritime.com",
      password: "crew123",
      role: "CREW",
    },
    {
      email: "maria.garcia@maritime.com",
      password: "crew123",
      role: "CREW",
    },
    {
      email: "david.johnson@maritime.com",
      password: "crew123",
      role: "CREW",
    },
    {
      email: "sarah.wilson@maritime.com",
      password: "crew123",
      role: "CREW",
    },
    {
      email: "michael.brown@maritime.com",
      password: "crew123",
      role: "CREW",
    },
  ];

  const createdCrewMembers: any[] = [];
  for (const crewData of crewMembers) {
    const crew = await prisma.user.upsert({
      where: { email: crewData.email },
      update: {},
      create: {
        email: crewData.email,
        passwordHash: await hashPassword(crewData.password),
        role: crewData.role,
        assignedVesselIds: "[]",
      },
    });
    createdCrewMembers.push(crew);
  }

  // Helper function to get random crew member
  const getRandomCrewMember = () => {
    return createdCrewMembers[
      Math.floor(Math.random() * createdCrewMembers.length)
    ];
  };

  // Create vessels with random crew assignments
  const vessels = [
    {
      name: "Ocean Explorer",
      imo: "IMO123456789",
      flag: "Panama",
      type: "Container Ship",
      status: "ACTIVE",
      lastInspectionDate: new Date("2024-01-15"),
    },
    {
      name: "Sea Voyager",
      imo: "IMO987654321",
      flag: "Liberia",
      type: "Bulk Carrier",
      status: "ACTIVE",
      lastInspectionDate: new Date("2024-02-20"),
    },
    {
      name: "Maritime Star",
      imo: "IMO555666777",
      flag: "Marshall Islands",
      type: "Tanker",
      status: "ACTIVE",
      lastInspectionDate: new Date("2024-03-10"),
    },
    {
      name: "Atlantic Pioneer",
      imo: "IMO111222333",
      flag: "Singapore",
      type: "Container Ship",
      status: "ACTIVE",
      lastInspectionDate: new Date("2024-04-05"),
    },
    {
      name: "Pacific Navigator",
      imo: "IMO444555666",
      flag: "Malta",
      type: "Bulk Carrier",
      status: "ACTIVE",
      lastInspectionDate: new Date("2024-05-12"),
    },
    {
      name: "Caribbean Express",
      imo: "IMO777888999",
      flag: "Cyprus",
      type: "Tanker",
      status: "ACTIVE",
      lastInspectionDate: new Date("2024-06-18"),
    },
  ];

  const createdVessels: any[] = [];
  for (const vesselData of vessels) {
    const randomCrew = getRandomCrewMember();
    const vessel = await prisma.vessel.upsert({
      where: { imo: vesselData.imo },
      update: { assignedToUserId: randomCrew.id },
      create: {
        ...vesselData,
        assignedToUserId: randomCrew.id,
      },
    });
    createdVessels.push(vessel);
  }

  // No longer using assignedVesselIds for assignments; relation used instead

  // Create issues for vessels
  const issues = [
    {
      vesselId: createdVessels[0].id,
      category: "Engine",
      description: "Engine overheating during long voyages",
      priority: "HIGH",
      status: "OPEN",
    },
    {
      vesselId: createdVessels[0].id,
      category: "Navigation",
      description: "GPS system intermittent failures",
      priority: "MEDIUM",
      status: "OPEN",
    },
    {
      vesselId: createdVessels[1].id,
      category: "Safety",
      description: "Lifeboat inspection overdue",
      priority: "HIGH",
      status: "OPEN",
    },
    {
      vesselId: createdVessels[1].id,
      category: "Engine",
      description: "Fuel pump needs replacement",
      priority: "MEDIUM",
      status: "RESOLVED",
    },
    {
      vesselId: createdVessels[2].id,
      category: "Navigation",
      description: "Radar system calibration needed",
      priority: "LOW",
      status: "OPEN",
    },
    {
      vesselId: createdVessels[2].id,
      category: "Safety",
      description: "Fire suppression system maintenance completed",
      priority: "MEDIUM",
      status: "RESOLVED",
    },
    {
      vesselId: createdVessels[3].id,
      category: "Engine",
      description: "Main engine vibration detected",
      priority: "HIGH",
      status: "OPEN",
    },
    {
      vesselId: createdVessels[4].id,
      category: "Navigation",
      description: "Autopilot system requires software update",
      priority: "MEDIUM",
      status: "OPEN",
    },
    {
      vesselId: createdVessels[5].id,
      category: "Safety",
      description: "Emergency generator test failed",
      priority: "HIGH",
      status: "OPEN",
    },
  ];

  await prisma.issue.createMany({
    data: issues,
  });

  console.log("Seed completed successfully!");
  console.log("Created users:");
  console.log("- Admin: admin@maritime.com / admin123");
  console.log("Created crew members:");
  crewMembers.forEach((member, index) => {
    console.log(`- ${member.email} / ${member.password}`);
  });
  console.log(
    `Created ${createdVessels.length} vessels and ${issues.length} issues`
  );
  console.log("All vessels have been randomly assigned to crew members.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
