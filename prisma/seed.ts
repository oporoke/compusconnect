
import { PrismaClient } from "@prisma/client";
import {
  students as mockStudents,
  exams as mockExams,
  grades as mockGrades,
  staff as mockStaff,
  admissions as mockAdmissions,
  feeStructures as mockFeeStructures,
  invoices as mockInvoices,
  payments as mockPayments,
  payrollRecords as mockPayrollRecords,
  announcements as mockAnnouncements,
  events as mockEvents,
  books as mockBooks,
  libraryTransactions as mockLibraryTransactions,
  vehicles as mockVehicles,
  drivers as mockDrivers,
  routes as mockRoutes,
  hostels as mockHostels,
  canteenAccounts as mockCanteenAccounts,
  canteenTransactions as mockCanteenTransactions,
  canteenMenu as mockCanteenMenu,
  alumniProfiles as mockAlumniProfiles,
  campaigns as mockCampaigns,
  pledges as mockPledges,
  donations as mockDonations,
  mentorships as mockMentorships,
  healthRecords as mockHealthRecords,
  clinicVisits as mockClinicVisits,
  assets as mockAssets,
  messages as mockMessages,
  onlineClasses as mockOnlineClasses,
  assignments as mockAssignments,
  courseMaterials as mockCourseMaterials,
  admissionRequirements as mockAdmissionRequirements,
  skills as mockSkills,
  threads as mockThreads,
  badges as mockBadges,
  careerInterests as mockCareerInterests,
  careerPaths as mockCareerPaths,
} from "../src/lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- INDEPENDENT DATA FIRST ---

  for (const skill of mockSkills) {
    await prisma.skill.upsert({ where: { id: skill.id }, update: {}, create: skill });
  }

  for (const badge of mockBadges) {
    await prisma.badge.upsert({ where: { id: badge.id }, update: {}, create: badge });
  }
  
  for (const req of mockAdmissionRequirements) {
    await prisma.admissionRequirement.upsert({ where: { id: req.id }, update: {}, create: req });
  }

  for (const fs of mockFeeStructures) {
    await prisma.feeStructure.upsert({ where: { id: fs.id }, update: {}, create: fs });
  }

  for (const announcement of mockAnnouncements) {
    await prisma.announcement.upsert({ where: { id: announcement.id }, update: {}, create: { ...announcement, date: new Date(announcement.date) } });
  }

  for (const event of mockEvents) {
    await prisma.event.upsert({ where: { id: event.id }, update: {}, create: { ...event, date: new Date(event.date) } });
  }

  for (const material of mockCourseMaterials) {
    await prisma.courseMaterial.upsert({ where: { id: material.id }, update: {}, create: material });
  }
  
  for (const onlineClass of mockOnlineClasses) {
    await prisma.onlineClass.upsert({ where: { id: onlineClass.id }, update: {}, create: onlineClass });
  }
  
  for (const assignment of mockAssignments) {
    await prisma.assignment.upsert({ where: { id: assignment.id }, update: {}, create: { ...assignment, dueDate: new Date(assignment.dueDate), skills: assignment.skills || [] } });
  }
  
  for (const book of mockBooks) {
    await prisma.book.upsert({ where: { id: book.id }, update: {}, create: book });
  }

  for (const driver of mockDrivers) {
    await prisma.driver.upsert({ where: { id: driver.id }, update: {}, create: driver });
  }

  for (const vehicle of mockVehicles) {
    await prisma.vehicle.upsert({ where: { id: vehicle.id }, update: {}, create: { ...vehicle, lat: vehicle.location.lat, lng: vehicle.location.lng } });
  }

  for (const item of mockCanteenMenu) {
      for (const menuItem of item.items) {
          await prisma.canteenMenuItem.upsert({ where: { name: menuItem.name }, update: {}, create: menuItem });
      }
  }

  for (const interest of mockCareerInterests) {
      await prisma.careerInterest.upsert({ where: { id: interest.id }, update: {}, create: interest });
  }

  for (const path of mockCareerPaths) {
      await prisma.careerPath.upsert({ where: { id: path.id }, update: {}, create: path });
  }

  for (const thread of mockThreads) {
      await prisma.discussionThread.upsert({ where: {id: thread.id }, update: {}, create: {
          id: thread.id,
          title: thread.title,
          authorName: thread.authorName,
          createdAt: new Date(thread.createdAt),
          replies: {
              create: thread.replies.map(r => ({...r, createdAt: new Date(r.createdAt)}))
          }
      }})
  }


  // --- DEPENDENT DATA ---
  
  for (const student of mockStudents) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: {},
      create: {
        id: student.id,
        name: student.name,
        grade: student.grade,
        section: student.section,
        disciplinaryRecords: {
          create: student.discipline?.map((d) => ({
            id: d.id,
            date: new Date(d.date),
            reason: d.reason,
            actionTaken: d.actionTaken,
          })),
        },
      },
    });
  }

  for (const staff of mockStaff) {
    await prisma.staff.upsert({
      where: { id: staff.id },
      update: {},
      create: {
        id: staff.id,
        name: staff.name,
        role: staff.role,
        department: staff.department,
        email: staff.email,
        phone: staff.phone,
        joiningDate: new Date(staff.joiningDate),
        salary: staff.salary,
        leavesTaken: staff.leavesTaken,
        leavesAvailable: staff.leavesAvailable,
        performanceNotes: staff.performanceNotes,
        taxDeduction: staff.deductions.tax,
        insuranceDeduction: staff.deductions.insurance,
        schoolId: staff.schoolId,
      },
    });
  }

  for (const exam of mockExams) {
    await prisma.exam.upsert({
      where: { id: exam.id },
      update: {},
      create: { ...exam, date: new Date(exam.date) },
    });
  }
  
  for (const grade of mockGrades) {
      await prisma.grade.upsert({
          where: { studentId_examId: { studentId: grade.studentId, examId: grade.examId } },
          update: {},
          create: grade
      })
  }

  for (const route of mockRoutes) {
      await prisma.route.upsert({ where: {id: route.id}, update: {}, create: route});
  }
  
  for(const admission of mockAdmissions) {
      await prisma.admission.upsert({ where: {id: admission.id}, update: {}, create: {...admission, date: new Date(admission.date), documents: admission.documents || []}})
  }
  
  for(const invoice of mockInvoices) {
      await prisma.invoice.upsert({where: {id: invoice.id}, update:{}, create: {...invoice, date: new Date(invoice.date), dueDate: new Date(invoice.dueDate), items: invoice.items}})
  }

  for(const payment of mockPayments) {
      await prisma.payment.upsert({ where: { id: payment.id }, update: {}, create: { ...payment, date: new Date(payment.date) }});
  }

  for(const payroll of mockPayrollRecords) {
    await prisma.payrollRecord.upsert({where: { id: payroll.id }, update: {}, create: payroll});
  }
  
  for (const lt of mockLibraryTransactions) {
      await prisma.libraryTransaction.upsert({ where: {id: lt.id}, update: {}, create: {...lt, date: new Date(lt.date), dueDate: lt.dueDate ? new Date(lt.dueDate) : null}})
  }

  for(const hostel of mockHostels) {
      await prisma.hostel.upsert({ where: {id: hostel.id }, update: {}, create: {
          id: hostel.id,
          name: hostel.name,
          capacity: hostel.capacity,
          rooms: {
              create: hostel.rooms.map(r => ({
                  id: r.id,
                  number: r.number,
                  capacity: r.capacity,
                  occupants: { connect: r.occupants.map(studentId => ({id: studentId})) }
              }))
          }
      }})
  }
  
  for (const asset of mockAssets) {
    await prisma.asset.upsert({ where: { id: asset.id }, update: {}, create: { ...asset, assignedToId: asset.assignedTo, purchaseDate: new Date(asset.purchaseDate) } });
  }

   for (const acc of mockCanteenAccounts) {
    await prisma.canteenAccount.upsert({ where: { studentId: acc.studentId }, update: {}, create: acc });
  }
  
  for (const trans of mockCanteenTransactions) {
    const account = await prisma.canteenAccount.findUnique({ where: { studentId: trans.studentId } });
    if (account) {
      await prisma.canteenTransaction.upsert({
        where: { id: trans.id },
        update: {},
        create: {
          id: trans.id,
          type: trans.type,
          amount: trans.amount,
          description: trans.description,
          date: new Date(trans.date),
          canteenAccountId: account.id,
        },
      });
    }
  }

  for(const alumni of mockAlumniProfiles) {
      await prisma.alumniProfile.upsert({ where: {id: alumni.id }, update: {}, create: alumni });
  }

  for(const campaign of mockCampaigns) {
      await prisma.campaign.upsert({ where: { id: campaign.id }, update: {}, create: {...campaign, startDate: new Date(campaign.startDate), endDate: campaign.endDate ? new Date(campaign.endDate) : null}})
  }

  for(const pledge of mockPledges) {
      await prisma.pledge.upsert({
        where: {id: pledge.id},
        update:{},
        create: {...pledge, date: new Date(pledge.date)}
      })
  }

  for(const donation of mockDonations) {
      await prisma.donation.upsert({
          where: {id: donation.id},
          update:{},
          create: {...donation, date: new Date(donation.date)}
      })
  }

   for (const record of mockHealthRecords) {
    await prisma.healthRecord.upsert({ where: { studentId: record.studentId }, update: {}, create: {...record, vaccinations: record.vaccinations || []} });
  }

  for (const visit of mockClinicVisits) {
    const healthRecord = await prisma.healthRecord.findUnique({ where: { studentId: visit.studentId } });
    if (healthRecord) {
      await prisma.clinicVisit.upsert({
        where: { id: visit.id },
        update: {},
        create: {
          id: visit.id,
          reason: visit.reason,
          treatment: visit.treatment,
          date: new Date(visit.date),
          healthRecordId: healthRecord.id
        },
      });
    }
  }
  
  for (const [conversationId, messages] of Object.entries(mockMessages)) {
    await prisma.conversation.upsert({
      where: { id: conversationId },
      update: {},
      create: {
        id: conversationId,
        members: conversationId.split('-'),
        messages: {
          create: messages.map((msg) => ({
            sender: msg.sender,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
          })),
        },
      },
    });
  }

   for (const m of mockMentorships) {
    await prisma.mentorship.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        mentorId: m.mentorId,
        menteeId: m.menteeId,
        startDate: new Date(m.startDate),
        status: m.status,
      },
    });
  }


  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
