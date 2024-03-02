import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import API from '../../config/API'; // Đảm bảo API được cấu hình đúng

export default function ShowListStudent({ route }) {
    const [students, setStudents] = useState([]);
    const { classStudyId } = route.params;

    // Thực hiện lấy danh sách sinh viên và điểm của họ
    useEffect(() => {
        const fetchStudentsAndScores = async () => {
            try {
                const response = await API.get(`https://nmau4669.pythonanywhere.com/StudyClass/${classStudyId}/get_list_student_results/`);
                setStudents(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchStudentsAndScores();
    }, [classStudyId]);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Danh Sách Sinh Viên Và Điểm</Text>
            {students.map((student, index) => (
                <View key={student.id} style={styles.studentContainer}>
                    <Image
                        source={{ uri: student.avatar }}
                        style={styles.avatar}
                    />
                    <Text style={styles.studentInfo}>{`${student.first_name} ${student.last_name} (${student.username})`}</Text>
                    {student.results.map((result, idx) => (
                        <View key={idx}>
                            <Text style={styles.score}>Điểm giữa kỳ: {result.midterm_score}</Text>
                            <Text style={styles.score}>Điểm cuối kỳ: {result.final_score}</Text>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    studentContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    studentInfo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    score: {
        fontSize: 16,
    },
});
