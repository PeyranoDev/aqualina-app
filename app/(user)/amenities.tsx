import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { Amenity, TimeSlot } from '../../lib/interfaces/amenity';
import { getAmenities, getAvailableSlots } from '../../lib/services/amenity-service';
import { createReservation } from '../../lib/services/reservation-service';
import { useAuth } from '../../lib/context/auth-context';

// Configuración del calendario en español
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.', 'Jul.', 'Ago.', 'Sep.', 'Oct.', 'Nov.', 'Dic.'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';


export default function AmenitiesScreen() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  
  const { user } = useAuth();

  useEffect(() => {
    // Cargar los amenities disponibles al iniciar la pantalla
    const fetchAmenities = async () => {
      setLoadingAmenities(true);
      const data = await getAmenities();
      setAmenities(data);
      // Seleccionar el primer amenity por defecto
      if (data.length > 0) {
        setSelectedAmenity(data[0]);
      }
      setLoadingAmenities(false);
    };

    fetchAmenities();
  }, []);

  useEffect(() => {
    // Cargar los horarios cuando se selecciona un amenity o una fecha
    if (selectedAmenity && selectedDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        setTimeSlots([]);
        setSelectedSlot(null);
        const slotsData = await getAvailableSlots(selectedAmenity.id, selectedDate);
        setTimeSlots(slotsData);
        setLoadingSlots(false);
      };

      fetchSlots();
    }
  }, [selectedAmenity, selectedDate]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleReserve = async () => {
    if (!selectedAmenity || !selectedDate || !selectedSlot) {
      Alert.alert('Error', 'Por favor, selecciona un amenity, fecha y horario para continuar.');
      return;
    }
    
    setIsReserving(true);
    try {
      const payload = {
        amenityId: selectedAmenity.id,
        date: selectedDate,
        hour: selectedSlot.hour,
      };
      const result = await createReservation(payload);
      
      if (result.success) {
        Alert.alert('¡Reserva Exitosa!', `Tu reserva para el ${selectedAmenity.name} el día ${selectedDate} a las ${selectedSlot.hour}hs ha sido confirmada.`);
        // Refrescar los horarios para mostrar el cambio de disponibilidad
        const updatedSlots = await getAvailableSlots(selectedAmenity.id, selectedDate);
        setTimeSlots(updatedSlots);
        setSelectedSlot(null);
      } else {
        Alert.alert('Error', 'No se pudo realizar la reserva. Inténtalo de nuevo.');
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un error inesperado al intentar reservar.');
      console.error(error);
    } finally {
      setIsReserving(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // Memoiza el objeto de fechas marcadas para evitar re-renders innecesarios del calendario
  const markedDates = useMemo(() => ({
    [selectedDate]: { selected: true, selectedColor: '#007AFF', disableTouchEvent: true },
  }), [selectedDate]);

  return (
    <>
      <Stack.Screen options={{ title: 'Reservar Amenity' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.headerTitle}>Amenities Disponibles</Text>

        {loadingAmenities ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <>
            {/* Por ahora solo mostramos el SUM, pero aquí se podría mapear `amenities` */}
            {selectedAmenity && (
              <View style={styles.amenityCard}>
                <Text style={styles.amenityTitle}>{selectedAmenity.name}</Text>
                <Text style={styles.amenityDescription}>{selectedAmenity.description}</Text>
              </View>
            )}

            <View style={styles.card}>
              <Text style={styles.cardTitle}>1. Selecciona una fecha</Text>
              <Calendar
                current={today}
                minDate={today}
                onDayPress={handleDayPress}
                markedDates={markedDates}
                monthFormat={'MMMM yyyy'}
                hideExtraDays={true}
                firstDay={1}
                theme={{
                  arrowColor: '#007AFF',
                  todayTextColor: '#007AFF',
                  textSectionTitleColor: '#5f5f5f'
                }}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>2. Selecciona un horario</Text>
              {loadingSlots ? (
                 <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }}/>
              ) : (
                <View style={styles.slotsContainer}>
                  {timeSlots.length > 0 ? timeSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot.hour}
                      style={[
                        styles.slotButton,
                        selectedSlot?.hour === slot.hour ? styles.slotSelected : {},
                        !slot.available ? styles.slotDisabled : {},
                      ]}
                      disabled={!slot.available}
                      onPress={() => setSelectedSlot(slot)}
                    >
                      <Text style={[
                        styles.slotText,
                        selectedSlot?.hour === slot.hour ? styles.slotSelectedText : {},
                        !slot.available ? styles.slotDisabledText : {},
                      ]}>{slot.hour}</Text>
                    </TouchableOpacity>
                  )) : <Text style={styles.noSlotsText}>No hay horarios disponibles para esta fecha.</Text>}
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={[styles.reserveButton, (!selectedSlot || isReserving) && styles.buttonDisabled]} 
              onPress={handleReserve}
              disabled={!selectedSlot || isReserving}
            >
              {isReserving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.reserveButtonText}>Confirmar Reserva</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  contentContainer: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A202C',
    marginBottom: 16,
  },
  amenityCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  amenityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  amenityDescription: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4A5568',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slotButton: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    alignItems: 'center',
    marginBottom: 10,
  },
  slotText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  slotSelected: {
    backgroundColor: '#007AFF',
  },
  slotSelectedText: {
    color: '#FFF',
  },
  slotDisabled: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E0',
  },
  slotDisabledText: {
    color: '#A0AEC0',
    textDecorationLine: 'line-through',
  },
  noSlotsText: {
    textAlign: 'center',
    color: '#718096',
    width: '100%',
    paddingVertical: 20,
  },
  reserveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    height: 54,
  },
  reserveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#A0AEC0',
  },
});