import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Memulai proses seeding database...');

  // Hapus data yang ada (opsional - hati-hati di production!)
  await prisma.notification.deleteMany();
  await prisma.record.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  console.log('✅ Data yang ada berhasil dihapus');

  // Seed Roles (Peran)
  const roleAdmin = await prisma.role.create({
    data: {
      name: 'Admin',
    },
  });

  const roleDokter = await prisma.role.create({
    data: {
      name: 'Dokter',
    },
  });

  const rolePerawat = await prisma.role.create({
    data: {
      name: 'Perawat',
    },
  });

  const roleResepsionis = await prisma.role.create({
    data: {
      name: 'Resepsionis',
    },
  });

  console.log('✅ Peran berhasil dibuat');

  // Seed Users (Pengguna)
  const passwordHash = await bcrypt.hash('password123', 10);

  const userAdmin = await prisma.user.create({
    data: {
      name: 'Administrator Klinik',
      email: 'admin@klinik.com',
      password: passwordHash,
      roleId: roleAdmin.id,
    },
  });

  const userDokter = await prisma.user.create({
    data: {
      name: 'Dr. Ahmad Wijaya',
      email: 'dokter@klinik.com',
      password: passwordHash,
      roleId: roleDokter.id,
    },
  });

  const userPerawat = await prisma.user.create({
    data: {
      name: 'Siti Nurhaliza',
      email: 'perawat@klinik.com',
      password: passwordHash,
      roleId: rolePerawat.id,
    },
  });

  const userResepsionis = await prisma.user.create({
    data: {
      name: 'Dewi Lestari',
      email: 'resepsionis@klinik.com',
      password: passwordHash,
      roleId: roleResepsionis.id,
    },
  });

  console.log('✅ Pengguna berhasil dibuat');

  // Seed Patients (Pasien)
  const pasien1 = await prisma.patient.create({
    data: {
      firstName: 'Budi',
      lastName: 'Santoso',
      dateOfBirth: new Date('1985-05-15'),
      phone: '+62812345678',
      email: 'budi.santoso@email.com',
      address: 'Jl. Sudirman No. 123, Jakarta Pusat',
    },
  });

  const pasien2 = await prisma.patient.create({
    data: {
      firstName: 'Sinta',
      lastName: 'Pratiwi',
      dateOfBirth: new Date('1990-08-22'),
      phone: '+62823456789',
      email: 'sinta.pratiwi@email.com',
      address: 'Jl. Thamrin No. 45, Jakarta Pusat',
    },
  });

  const pasien3 = await prisma.patient.create({
    data: {
      firstName: 'Agus',
      lastName: 'Setiawan',
      dateOfBirth: new Date('1978-12-10'),
      phone: '+62834567890',
      email: 'agus.setiawan@email.com',
      address: 'Jl. Gatot Subroto No. 67, Jakarta Selatan',
    },
  });

  const pasien4 = await prisma.patient.create({
    data: {
      firstName: 'Rina',
      lastName: 'Kusuma',
      dateOfBirth: new Date('1995-03-30'),
      phone: '+62845678901',
      address: 'Jl. Kuningan No. 89, Jakarta Selatan',
    },
  });

  const pasien5 = await prisma.patient.create({
    data: {
      firstName: 'Andi',
      lastName: 'Permana',
      dateOfBirth: new Date('1982-07-18'),
      phone: '+62856789012',
      email: 'andi.permana@email.com',
      address: 'Jl. Rasuna Said No. 12, Jakarta Selatan',
    },
  });

  console.log('✅ Pasien berhasil dibuat');

  // Seed Appointments (Janji Temu)
  await prisma.appointment.create({
    data: {
      date: new Date('2025-10-28'),
      time: '09:00',
      type: 'CHECK_UP',
      status: 'SCHEDULED',
      patientId: pasien1.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date('2025-10-28'),
      time: '10:30',
      type: 'CONSULTATION',
      status: 'SCHEDULED',
      patientId: pasien2.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date('2025-10-25'),
      time: '14:00',
      type: 'FOLLOW_UP',
      status: 'COMPLETED',
      patientId: pasien3.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date('2025-10-29'),
      time: '11:00',
      type: 'CHECK_UP',
      status: 'SCHEDULED',
      patientId: pasien4.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date('2025-10-26'),
      time: '15:30',
      type: 'CONSULTATION',
      status: 'CANCELED',
      patientId: pasien1.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date('2025-10-30'),
      time: '13:00',
      type: 'FOLLOW_UP',
      status: 'SCHEDULED',
      patientId: pasien5.id,
    },
  });

  console.log('✅ Janji temu berhasil dibuat');

  // Seed Medical Records (Rekam Medis)
  await prisma.record.create({
    data: {
      medicalHistory: 'Hipertensi, Diabetes Tipe 2',
      currentMedications: 'Metformin 500mg, Lisinopril 10mg',
      allergies: 'Penisilin',
      lastVisit: new Date('2025-09-15'),
      nextAppointment: new Date('2025-10-28'),
      patientId: pasien1.id,
    },
  });

  await prisma.record.create({
    data: {
      medicalHistory: 'Asma',
      currentMedications: 'Inhaler Albuterol',
      allergies: 'Tidak ada',
      lastVisit: new Date('2025-08-20'),
      nextAppointment: new Date('2025-10-28'),
      patientId: pasien2.id,
    },
  });

  await prisma.record.create({
    data: {
      medicalHistory: 'Operasi jantung (2020)',
      currentMedications: 'Aspirin 81mg, Atorvastatin 20mg',
      allergies: 'Obat sulfa',
      lastVisit: new Date('2025-10-25'),
      nextAppointment: new Date('2025-11-25'),
      patientId: pasien3.id,
    },
  });

  await prisma.record.create({
    data: {
      medicalHistory: 'Tidak ada',
      currentMedications: 'Tidak ada',
      allergies: 'Makanan laut',
      lastVisit: null,
      nextAppointment: new Date('2025-10-29'),
      patientId: pasien4.id,
    },
  });

  await prisma.record.create({
    data: {
      medicalHistory: 'Gastritis kronis',
      currentMedications: 'Omeprazole 20mg',
      allergies: 'Tidak ada',
      lastVisit: new Date('2025-10-10'),
      nextAppointment: new Date('2025-10-30'),
      patientId: pasien5.id,
    },
  });

  console.log('✅ Rekam medis berhasil dibuat');

  // Seed Invoices (Tagihan)
  await prisma.invoice.create({
    data: {
      date: new Date('2025-09-15'),
      amount: 500000,
      description: 'Konsultasi umum dan obat-obatan',
      patientId: pasien1.id,
    },
  });

  await prisma.invoice.create({
    data: {
      date: new Date('2025-08-20'),
      amount: 350000,
      description: 'Pemeriksaan asma dan resep inhaler',
      patientId: pasien2.id,
    },
  });

  await prisma.invoice.create({
    data: {
      date: new Date('2025-10-25'),
      amount: 750000,
      description: 'Kontrol kardiologi dan EKG',
      patientId: pasien3.id,
    },
  });

  await prisma.invoice.create({
    data: {
      date: new Date('2025-10-20'),
      amount: 250000,
      description: 'Konsultasi awal',
      patientId: pasien4.id,
    },
  });

  await prisma.invoice.create({
    data: {
      date: new Date('2025-10-10'),
      amount: 400000,
      description: 'Pemeriksaan gastritis dan resep obat',
      patientId: pasien5.id,
    },
  });

  await prisma.invoice.create({
    data: {
      date: new Date('2025-10-15'),
      amount: 300000,
      description: 'Pemeriksaan tekanan darah dan konsultasi',
      patientId: pasien1.id,
    },
  });

  console.log('✅ Tagihan berhasil dibuat');

  // Seed Notifications (Notifikasi)
  await prisma.notification.create({
    data: {
      message: 'Pengingat janji temu: Budi Santoso - Besok pukul 09:00',
      date: new Date('2025-10-27'),
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      message: 'Pendaftaran pasien baru: Rina Kusuma',
      date: new Date('2025-10-26'),
      isRead: true,
    },
  });

  await prisma.notification.create({
    data: {
      message: 'Janji temu dibatalkan: Budi Santoso - 2025-10-26',
      date: new Date('2025-10-25'),
      isRead: true,
    },
  });

  await prisma.notification.create({
    data: {
      message: 'Pembayaran diterima: Agus Setiawan - Rp 750.000',
      date: new Date('2025-10-25'),
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      message: 'Pengingat: Sinta Pratiwi memiliki janji temu besok',
      date: new Date('2025-10-27'),
      isRead: false,
    },
  });

  await prisma.notification.create({
    data: {
      message: 'Stok obat perlu diisi ulang: Metformin',
      date: new Date('2025-10-26'),
      isRead: false,
    },
  });

  console.log('✅ Notifikasi berhasil dibuat');
  console.log('🎉 Proses seeding database berhasil diselesaikan!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi kesalahan saat seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });