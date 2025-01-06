import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const ProfileScreen = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const achievements = [
    { icon: 'award', label: 'Workout Warrior', desc: '30 workouts completed' },
    { icon: 'trending-up', label: 'Goal Crusher', desc: 'Hit weight goal' },
    { icon: 'zap', label: 'Early Bird', desc: '5 morning workouts' },
  ];

  const stats = [
    { label: 'Workouts', value: '48' },
    { label: 'Calories', value: '12.4k' },
    { label: 'Hours', value: '26' },
  ];

  const renderAchievement = ({ icon, label, desc }) => (
    <View style={styles.achievementCard} key={label}>
      <Icon name={icon} size={24} color="#35AAFF" />
      <Text style={styles.achievementTitle}>{label}</Text>
      <Text style={styles.achievementDesc}>{desc}</Text>
    </View>
  );

  const renderStat = ({ label, value }) => (
    <View style={styles.statItem} key={label}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton}>
              <Icon name="edit-2" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>João Silva</Text>
          <Text style={styles.membershipStatus}>Premium Member</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map(renderStat)}
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.achievementsContainer}>
              {achievements.map(renderAchievement)}
            </View>
          </ScrollView>
        </View>

        {/* Personal Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Icon name="mail" size={20} color="#666" />
              <Text style={styles.infoText}>joao.silva@email.com</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar" size={20} color="#666" />
              <Text style={styles.infoText}>28 anos</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="target" size={20} color="#666" />
              <Text style={styles.infoText}>Meta: Ganho de massa</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          <View style={styles.settingsContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon name="bell" size={20} color="#666" />
                <Text style={styles.settingText}>Notificações</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#767577', true: '#35AAFF' }}
                thumbColor={notifications ? '#fff' : '#f4f3f4'}
              />
            </View>
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <Icon name="moon" size={20} color="#666" />
                <Text style={styles.settingText}>Modo Escuro</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#767577', true: '#35AAFF' }}
                thumbColor={darkMode ? '#fff' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out" size={20} color="#FF375B" />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#35AAFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  membershipStatus: {
    fontSize: 16,
    color: '#35AAFF',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  achievementsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginRight: 15,
    width: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  settingsContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FF375B',
    fontWeight: '600',
  },
});

export default ProfileScreen;

