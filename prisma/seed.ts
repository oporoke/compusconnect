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
    assets
} from '../src/lib/data';

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // Seed Students and their related records
  for (const student of students) {
    await prisma.student.create({
      data: {
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
    await prisma.exam.create({
      data: {
        id: exam.id,
        name: exam.name,
        date: new Date(exam.date),
        subjects: exam.subjects,
      },
    })
  }
  
  // Seed Grades
  for (const grade of grades) {
      await prisma.grade.create({
          data: {
              studentId: grade.studentId,
              examId: grade.examId,
              scores: grade.scores
          }
      })
  }

  // Seed Staff
  for (const s of staff) {
    await prisma.staff.create({
      data: {
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
    await prisma.asset.create({
        data: {
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
      await prisma.admission.create({
          data: {
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
  await prisma.feeStructure.createMany({ data: feeStructures.map(fs => ({ ...fs, grades: fs.grades })) });
  for(const invoice of invoices) {
    await prisma.invoice.create({
        data: {
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
  await prisma.announcement.createMany({ data: announcements.map(a => ({...a, date: new Date(a.date)})) });
  await prisma.event.createMany({ data: events.map(e => ({...e, date: new Date(e.date)})) });

  // Seed Library
  await prisma.book.createMany({ data: books });
  for(const lt of libraryTransactions) {
    await prisma.libraryTransaction.create({
        data: {
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
  await prisma.vehicle.createMany({data: vehicles.map(v => ({...v, lat: v.location.lat, lng: v.location.lng}))});
  await prisma.driver.createMany({data: drivers});
  await prisma.route.createMany({data: routes.map(r => ({...r, stops: r.stops}))});
  
  // Seed Hostel
  for (const h of hostels) {
      await prisma.hostel.create({
          data: {
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
      await prisma.canteenAccount.create({data: acc})
  }
  for (const trans of canteenTransactions) {
      const account = await prisma.canteenAccount.findUnique({where: {studentId: trans.studentId}});
      if(account) {
          await prisma.canteenTransaction.create({data: {...trans, date: new Date(trans.date), canteenAccountId: account.id}})
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
  await prisma.alumniProfile.createMany({data: alumniProfiles});
  for(const m of mentorships) {
      await prisma.mentorship.create({data: {
        id: m.id,
        mentorId: m.mentorId,
        menteeId: m.menteeId,
        startDate: new Date(m.startDate),
        status: m.status
      }})
  }

  // Health
  for(const hr of healthRecords) {
      await prisma.healthRecord.create({data: {
        studentId: hr.studentId,
        bloodGroup: hr.bloodGroup,
        allergies: hr.allergies,
        vaccinations: hr.vaccinations,
        clinicVisits: {
            create: clinicVisits.filter(cv => cv.studentId === hr.studentId).map(cv => ({
                id: cv.id,
                reason: cv.reason,
                treatment: cv.treatment,
                date: new Date(cv.date)
            }))
        }
      }})
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
