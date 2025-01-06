import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { LineChart } from 'react-native-chart-kit';

export default function HomeScreen() {
  const screenWidth = Dimensions.get('window').width;

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 72, 60],
      },
    ],
  };

  const StatCard = ({ title, value, subtitle, icon }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Icon name={icon} size={20} color="#666" />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
  );

  const UpcomingWorkout = ({ name, time }) => (
    <TouchableOpacity style={styles.workoutItem}>
      <Icon name="activity" size={20} color="#666" />
      <View style={styles.workoutInfo}>
        <Text style={styles.workoutName}>{name}</Text>
        <Text style={styles.workoutTime}>{time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Dashboard</Text>
          <TouchableOpacity>
            <Icon name="bell" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <StatCard
            title="Workouts"
            value="12"
            subtitle="+2 from last week"
            icon="award"
          />
          <StatCard
            title="Weight"
            value="75 kg"
            subtitle="-2 kg this month"
            icon="trending-down"
          />
          <StatCard
            title="Trainers"
            value="2"
            subtitle="Working with you"
            icon="users"
          />
          <StatCard
            title="Score"
            value="78/100"
            subtitle="Fitness level"
            icon="heart"
          />
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Weekly Activity</Text>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(106, 90, 205, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.upcomingWorkouts}>
          <Text style={styles.sectionTitle}>Upcoming Workouts</Text>
          <UpcomingWorkout name="Upper Body" time="Tomorrow at 9:00 AM" />
          <UpcomingWorkout name="Cardio" time="Thursday at 10:00 AM" />
          <UpcomingWorkout name="Lower Body" time="Friday at 8:00 AM" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  upcomingWorkouts: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  workoutInfo: {
    marginLeft: 15,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '500',
  },
  workoutTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

