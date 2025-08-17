
import { PrismaClient } from '@prisma/client'
import {
    students,
    exams as mockExams,
    grades,
    staff,
    admissions,
    feeStructures,
    invoices,
    announcements,
    events,
    books,
    libraryTransactions,
    vehicles,
    drivers,
    routes,
    hostels,
    canteenAccounts,
    canteenTransactions,
    canteenMenu,
    alumniProfiles,
    mentorships,
    healthRecords,
    clinicVisits,
    assets,
    messages as mockMessages,
    onlineClasses,
    assignments,
    courseMaterials
} from '../src/lib/data';

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Seed Students and their related records
  for (const student of students) {
    await prisma.student.upsert({
      where: { id: student.id },
      update: {},
      create: {
        id: student.id,
        name: student.name,
        grade: student.grade,
        section: student.section,
        discipline: {
          create: student.discipline?.map(d => ({
            id: d.id,
            date: new Date(d.date),
            reason: d.reason,
            actionTaken: d.actionTaken
          }))
        }
      },
    })
  }

  // Seed Exams
  for (const exam of mockExams) {
    await prisma.exam.upsert({
      where: { id: exam.id },
      update: {},
      create: {
        id: exam.id,
        name: exam.name,
        date: new Date(exam.date),
        subjects: exam.subjects,
      },
    })
  }
  
  // Seed Grades
  for (const grade of grades) {
      await prisma.grade.upsert({
          where: { studentId_examId: { studentId: grade.studentId, examId: grade.examId } },
          update: { scores: grade.scores },
          create: {
              studentId: grade.studentId,
              examId: grade.examId,
              scores: grade.scores
          }
      })
  }

  // Seed Staff
  for (const s of staff) {
    await prisma.staff.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        name: s.name,
        role: s.role,
        department: s.department,
        email: s.email,
        phone: s.phone,
        joiningDate: new Date(s.joiningDate),
        salary: s.salary,
        leavesTaken: s.leavesTaken,
        leavesAvailable: s.leavesAvailable,
        performanceNotes: s.performanceNotes,
        taxDeduction: s.deductions.tax,
        insuranceDeduction: s.deductions.insurance,
        schoolId: s.schoolId,
      },
    })
  }
  
  // Seed Assets
  for (const asset of assets) {
    await prisma.asset.upsert({
        where: { id: asset.id },
        update: {},
        create: {
            id: asset.id,
            name: asset.name,
            type: asset.type,
            status: asset.status,
            assignedToId: asset.assignedTo,
            purchaseDate: new Date(asset.purchaseDate)
        }
    })
  }

  // Seed Admissions
  for (const admission of admissions) {
      await prisma.admission.upsert({
          where: { id: admission.id },
          update: {},
          create: {
            id: admission.id,
            name: admission.name,
            age: admission.age,
            previousSchool: admission.previousSchool,
            grade: admission.grade,
            parentName: admission.parentName,
            parentEmail: admission.parentEmail,
            date: new Date(admission.date),
            status: admission.status,
            documents: admission.documents || []
          }
      })
  }

  // Seed Finance
  for (const fs of feeStructures) {
      await prisma.feeStructure.upsert({ where: { id: fs.id }, update: {}, create: { ...fs, grades: fs.grades } });
  }

  for(const invoice of invoices) {
    await prisma.invoice.upsert({
        where: { id: invoice.id },
        update: {},
        create: {
            id: invoice.id,
            studentId: invoice.studentId,
            date: new Date(invoice.date),
            dueDate: new Date(invoice.dueDate),
            items: invoice.items,
            total: invoice.total,
            status: invoice.status
        }
    })
  }

  // Seed Communication
  for (const a of announcements) {
    await prisma.announcement.upsert({where: {id: a.id }, update: {}, create: {...a, date: new Date(a.date)}});
  }
  for (const e of events) {
    await prisma.event.upsert({where: {id: e.id}, update: {}, create: {...e, date: new Date(e.date)}});
  }
  
    // Seed LMS
  for (const a of assignments) {
      await prisma.assignment.upsert({ where: { id: a.id }, update: {}, create: { ...a, dueDate: new Date(a.dueDate) } });
  }
  for (const m of courseMaterials) {
      await prisma.courseMaterial.upsert({ where: { id: m.id }, update: {}, create: m });
  }
  for (const c of onlineClasses) {
      await prisma.onlineClass.upsert({ where: { id: c.id }, update: {}, create: c });
  }


  // Seed Messages and Conversations
  for (const [conversationId, messages] of Object.entries(mockMessages)) {
      await prisma.conversation.upsert({
          where: { id: conversationId },
          update: {},
          create: {
              id: conversationId,
              members: conversationId.split('-'),
              messages: {
                  create: messages.map(msg => ({
                      sender: msg.sender,
                      content: msg.content,
                      timestamp: new Date(msg.timestamp)
                  }))
              }
          }
      })
  }

  // Seed Library
  for (const b of books) {
      await prisma.book.upsert({where: {id: b.id}, update: {}, create: b});
  }
  for(const lt of libraryTransactions) {
    await prisma.libraryTransaction.upsert({
        where: {id: lt.id},
        update: {},
        create: {
            id: lt.id,
            studentId: lt.studentId,
            bookId: lt.bookId,
            type: lt.type,
            date: new Date(lt.date),
            dueDate: lt.dueDate ? new Date(lt.dueDate) : null
        }
    })
  }

  // Seed Transport
  for (const v of vehicles) {
      await prisma.vehicle.upsert({where: {id: v.id}, update: {}, create: {...v, lat: v.location.lat, lng: v.location.lng}});
  }
  for(const d of drivers) {
      await prisma.driver.upsert({where: {id: d.id}, update: {}, create: d});
  }
  for(const r of routes) {
      await prisma.route.upsert({where: {id: r.id}, update: {}, create: {...r, stops: r.stops}});
  }
  
  // Seed Hostel
  for (const h of hostels) {
      await prisma.hostel.upsert({
          where: {id: h.id},
          update: {},
          create: {
              id: h.id,
              name: h.name,
              capacity: h.capacity,
              rooms: {
                  create: h.rooms.map(r => ({
                      id: r.id,
                      number: r.number,
                      capacity: r.capacity,
                      occupants: {
                          connect: r.occupants.map(studentId => ({id: studentId}))
                      }
                  }))
              }
          }
      })
  }
  
  // Seed Extensions
  // Canteen
  for (const acc of canteenAccounts) {
      await prisma.canteenAccount.upsert({where: {studentId: acc.studentId}, update: {}, create: acc})
  }
  for (const trans of canteenTransactions) {
      const account = await prisma.canteenAccount.findUnique({where: {studentId: trans.studentId}});
      if(account) {
          await prisma.canteenTransaction.upsert({where: {id: trans.id}, update: {}, create: {...trans, date: new Date(trans.date), canteenAccountId: account.id}})
      }
  }
  for(const dayMenu of canteenMenu) {
      for(const item of dayMenu.items){
          await prisma.canteenMenuItem.upsert({
            where: { name: item.name },
            update: { price: item.price, stock: item.stock },
            create: { name: item.name, price: item.price, stock: item.stock }
        })
      }
  }

  // Alumni
  for (const ap of alumniProfiles) {
      await prisma.alumniProfile.upsert({where: {id: ap.id}, update: {}, create: ap});
  }
  for(const m of mentorships) {
      await prisma.mentorship.upsert({
          where: {id: m.id},
          update: {},
          create: {
            id: m.id,
            mentorId: m.mentorId,
            menteeId: m.menteeId,
            startDate: new Date(m.startDate),
            status: m.status
      }})
  }

  // Health
  for(const hr of healthRecords) {
    const student = await prisma.student.findUnique({ where: { id: hr.studentId }});
    if (student) {
        await prisma.healthRecord.upsert({
            where: {studentId: hr.studentId},
            update: {},
            create: {
              studentId: hr.studentId,
              bloodGroup: hr.bloodGroup,
              allergies: hr.allergies,
              vaccinations: hr.vaccinations,
              clinicVisits: {
                  create: clinicVisits.filter(cv => cv.studentId === hr.studentId).map(cv => ({
                      id: cv.id,
                      studentId: cv.studentId, // Denormalized field
                      reason: cv.reason,
                      treatment: cv.treatment,
                      date: new Date(cv.date)
                  }))
              }
          }
        })
    }
  }


  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
