import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reservationService, Reservation, CreateReservationDto } from '../../lib/services/reservation-service';
import { reservationService, Reservation, CreateReservationDto } from '../../lib/services/reservation-service';

// Horarios disponibles
const weekdaySlots = ['19:00', '20:00', '21:00'];
const sundaySlots = ['12:00', '13:00', '14:00'];

// Duración de cada reserva en horas
const RESERVATION_DURATION = 1;

// Obtener fechas para los próximos 14 días
const getDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  
  return dates;
};

export default function AmenitiesScreen() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [existingReservations, setExistingReservations] = useState<Reservation[]>([]);
  const dates = getDates();

  // Cargar reservas existentes cuando cambia la fecha seleccionada
  useEffect(() => {
    if (selectedDate) {
      fetchReservations(selectedDate);
    }
  }, [selectedDate]);

  const fetchReservations = async (date: Date) => {
    setLoading(true);
    try {
      const formattedDate = date.toISOString().split('T')[0];
      const reservations = await reservationService.getReservationsByDate(formattedDate);
      setExistingReservations(reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
      Alert.alert('Error', 'No se pudieron cargar las reservas');
      const reservations = await reservationService.getReservationsByDate(formattedDate);
      setExistingReservations(reservations);
    } catch (error) {
      console.error('Error fetching reservations:', error.message);
      Alert.alert('Error', 'No se pudieron cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  // Verificar si un horario ya está reservado
  const isTimeSlotReserved = (timeSlot: string) => {
    return existingReservations.some(reservation => 
      reservation.Start_time === timeSlot && reservation.Status === 'confirmed'
      reservation.Start_time === timeSlot && reservation.Status === 'confirmed'
    );
  };


  const createReservation = async () => {
    if (!selectedDate || !selectedTime) return;
    
    setReserving(true);
    try {
  
      const startTime = selectedTime;
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const endHour = startHour + RESERVATION_DURATION;
      const endTime = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
      
      const formattedDate = selectedDate.toISOString().split('T')[0];

      const reservationData: CreateReservationDto = {
        Amenity: 'sum',
        Reservation_date: formattedDate,
        Start_time: startTime,
        End_time: endTime,
      };

      const reservation = await reservationService.createReservation(reservationData);

      if (reservation) {
        Alert.alert(
          'Reserva Confirmada', 
          `Su reserva para el ${selectedDate.toLocaleDateString()} a las ${selectedTime} ha sido confirmada.`
        );
        
        // Resetear selecciones y recargar reservas
        setSelectedTime(null);
        fetchReservations(selectedDate);
      } else {
        throw new Error('No se pudo crear la reserva');
      }
    } catch (error) {
      console.error('Error creating reservation:', error.message);
      Alert.alert('Error', 'No se pudo crear la reserva');
    } finally {
      setReserving(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleReservation = () => {
    if (selectedDate && selectedTime) {
      const formattedDate = selectedDate.toLocaleDateString();
      Alert.alert(
        'Confirmar Reserva',
        `¿Desea reservar el SUM para el ${formattedDate} a las ${selectedTime}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Confirmar', onPress: createReservation }
        ]
      );
    } else {
      Alert.alert('Error', 'Por favor seleccione fecha y horario');
    }
  };

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day >= 1 && day <= 5; 
  };

  const isSunday = (date: Date) => {
    return date.getDay() === 0; 
  };

  const getAvailableSlots = (date: Date) => {
    if (isWeekday(date)) return weekdaySlots;
    if (isSunday(date)) return sundaySlots;
    return [];
  };

  return (
    <>
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Reserva del SUM</Text>
      <Text style={styles.sectionTitle}>Seleccione una fecha:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
        {dates.map((date, index) => {
          const isAvailable = isWeekday(date) || isSunday(date);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateItem,
                selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDate,
                !isAvailable && styles.unavailableDate
              ]}
              onPress={() => isAvailable && handleDateSelect(date)}
              disabled={!isAvailable}
            >
              <Text style={[
                styles.dateDay,
                selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                !isAvailable && styles.unavailableDateText
              ]}>
                {date.getDate()}
              </Text>
              <Text style={[
                styles.dateMonth,
                selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                !isAvailable && styles.unavailableDateText
              ]}>
                {date.toLocaleDateString('es-ES', { month: 'short' })}
              </Text>
              <Text style={[
                styles.dateWeekday,
                selectedDate && date.toDateString() === selectedDate.toDateString() && styles.selectedDateText,
                !isAvailable && styles.unavailableDateText
              ]}>
                {date.toLocaleDateString('es-ES', { weekday: 'short' })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedDate && (
        <>
          <Text style={styles.sectionTitle}>Horarios disponibles:</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0066cc" style={styles.loader} />
          ) : (
            <View style={styles.timeSlotsContainer}>
              {getAvailableSlots(selectedDate).map((time, index) => {
                const isReserved = isTimeSlotReserved(time);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timeSlot,
                      selectedTime === time && styles.selectedTimeSlot,
                      isReserved && styles.reservedTimeSlot
                    ]}
                    onPress={() => !isReserved && handleTimeSelect(time)}
                    disabled={isReserved}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTime === time && styles.selectedTimeSlotText,
                      isReserved && styles.reservedTimeSlotText
                    ]}>
                      {time}
                    </Text>
                    {isReserved && (
                      <Text style={styles.reservedText}>Reservado</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </>
      )}

      <TouchableOpacity
        style={[
          styles.reserveButton,
          (!selectedDate || !selectedTime || reserving) && styles.disabledButton
        ]}
        onPress={handleReservation}
        disabled={!selectedDate || !selectedTime || reserving}
      >
        {reserving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
        )}
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  datesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateItem: {
    width: 70,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginRight: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedDate: {
    backgroundColor: '#0066cc',
  },
  unavailableDate: {
    backgroundColor: '#f0f0f0',
  },
  dateDay: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  dateMonth: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  dateWeekday: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  selectedDateText: {
    color: '#fff',
  },
  unavailableDateText: {
    color: '#aaa',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    margin: '1.5%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedTimeSlot: {
    backgroundColor: '#0066cc',
  },
  reservedTimeSlot: {
    backgroundColor: '#f0f0f0',
  },
  timeSlotText: {
    fontSize: 16,
    color: '#333',
  },
  selectedTimeSlotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reservedTimeSlotText: {
    color: '#999',
  },
  reservedText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  reserveButton: {
    backgroundColor: '#0066cc',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  reserveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loader: {
    marginVertical: 20,
  },
});