import mongoose from 'mongoose';
import appointmentModel from './models/appointmentModel.js';
import userModel from './models/userModel.js';
import doctorModel from './models/doctorModel.js';

// Create mock data for MMC Mardan Medical Complex
const createMockData = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/prescription_full-stack_doctor');
        console.log('Connected to MongoDB');

        // Get existing doctors
        const doctors = await doctorModel.find({});
        console.log(`Found ${doctors.length} doctors`);

        if (doctors.length === 0) {
            console.log('No doctors found. Please run seed-doctors.js first.');
            return;
        }

        // Create mock users
        const mockUsers = [
            {
                name: 'Ahmed Khan',
                email: 'ahmed.khan@mmc.com',
                password: 'user123',
                phone: '+92-300-1234567',
                address: { line1: 'Mardan City', line2: 'Khyber Pakhtunkhwa' },
                dob: '1990-05-15',
                gender: 'Male'
            },
            {
                name: 'Fatima Zahra',
                email: 'fatima.zahra@mmc.com',
                password: 'user123',
                phone: '+92-301-2345678',
                address: { line1: 'Peshawar', line2: 'Khyber Pakhtunkhwa' },
                dob: '1992-08-22',
                gender: 'Female'
            },
            {
                name: 'Muhammad Ali',
                email: 'muhammad.ali@mmc.com',
                password: 'user123',
                phone: '+92-321-3456789',
                address: { line1: 'Islamabad', line2: 'Federal Capital' },
                dob: '1988-12-10',
                gender: 'Male'
            },
            {
                name: 'Ayesha Siddiqui',
                email: 'ayesha.siddiqui@mmc.com',
                password: 'user123',
                phone: '+92-333-4567890',
                address: { line1: 'Lahore', line2: 'Punjab' },
                dob: '1995-03-18',
                gender: 'Female'
            },
            {
                name: 'Omar Farooq',
                email: 'omar.farooq@mmc.com',
                password: 'user123',
                phone: '+92-345-5678901',
                address: { line1: 'Karachi', line2: 'Sindh' },
                dob: '1991-07-25',
                gender: 'Male'
            }
        ];

        // Insert mock users
        const insertedUsers = [];
        for (const userData of mockUsers) {
            const existingUser = await userModel.findOne({ email: userData.email });
            if (!existingUser) {
                const user = new userModel(userData);
                await user.save();
                insertedUsers.push(user);
            } else {
                insertedUsers.push(existingUser);
            }
        }

        console.log(`Created/found ${insertedUsers.length} users`);

        // Create mock appointments
        const mockAppointments = [];
        const today = new Date();
        const todayStr = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;

        for (let i = 0; i < 20; i++) {
            const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
            const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
            
            // Generate random date within last 30 days
            const randomDate = new Date(today);
            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
            const dateStr = `${randomDate.getDate()}_${randomDate.getMonth() + 1}_${randomDate.getFullYear()}`;
            
            // Random time slots
            const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];
            const randomTime = timeSlots[Math.floor(Math.random() * timeSlots.length)];
            
            // Random status
            const isCancelled = Math.random() < 0.2; // 20% chance of cancellation
            const isCompleted = !isCancelled && randomDate < today; // Completed if in the past and not cancelled

            const appointment = {
                userId: randomUser._id,
                docId: randomDoctor._id,
                userData: randomUser,
                docData: randomDoctor,
                amount: randomDoctor.fees,
                slotTime: randomTime,
                slotDate: dateStr,
                date: randomDate.getTime(),
                cancelled: isCancelled,
                payment: isCompleted
            };

            mockAppointments.push(appointment);
        }

        // Insert mock appointments
        const insertedAppointments = [];
        for (const appointmentData of mockAppointments) {
            const existingAppointment = await appointmentModel.findOne({
                userId: appointmentData.userId,
                docId: appointmentData.docId,
                slotDate: appointmentData.slotDate,
                slotTime: appointmentData.slotTime
            });

            if (!existingAppointment) {
                const appointment = new appointmentModel(appointmentData);
                await appointment.save();
                insertedAppointments.push(appointment);
            }
        }

        console.log(`Created ${insertedAppointments.length} mock appointments`);

        // Update doctor slots
        for (const doctor of doctors) {
            const doctorAppointments = await appointmentModel.find({ 
                docId: doctor._id, 
                cancelled: false 
            });

            const slots_booked = {};
            doctorAppointments.forEach(apt => {
                if (!slots_booked[apt.slotDate]) {
                    slots_booked[apt.slotDate] = [];
                }
                slots_booked[apt.slotDate].push(apt.slotTime);
            });

            await doctorModel.findByIdAndUpdate(doctor._id, { slots_booked });
        }

        console.log('Updated doctor slots');

        // Get final statistics
        const totalUsers = await userModel.countDocuments();
        const totalDoctors = await doctorModel.countDocuments();
        const totalAppointments = await appointmentModel.countDocuments();
        const completedAppointments = await appointmentModel.countDocuments({ cancelled: false });
        const cancelledAppointments = await appointmentModel.countDocuments({ cancelled: true });

        console.log('\n=== MMC Mardan Medical Complex - Mock Data Summary ===');
        console.log(`Total Users: ${totalUsers}`);
        console.log(`Total Doctors: ${totalDoctors}`);
        console.log(`Total Appointments: ${totalAppointments}`);
        console.log(`Completed Appointments: ${completedAppointments}`);
        console.log(`Cancelled Appointments: ${cancelledAppointments}`);
        console.log('=====================================================');

        mongoose.connection.close();
        console.log('Mock data seeding completed!');

    } catch (error) {
        console.error('Error seeding mock data:', error);
        mongoose.connection.close();
    }
};

createMockData();
