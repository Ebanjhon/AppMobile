import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import InputScoreStyles from './InputScoreStyles';
import API, { authApi, endpoints } from '../../config/API';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddScores({ route }) {
    const [students, setStudents] = useState([]);
    const [scoreColumns, setScoreColumns] = useState([
        { column_name: 'midterm_score', scores: [] },
        { column_name: 'final_score', scores: [] },
    ]);
    const { classStudyId } = route.params;
    const [loading, setLoading] = useState(false)
    const [apiScores, setApiScores] = useState([]);

    // thực hiện lấy dánh sách sinh viên 
    useEffect(() => {
        const fetchStudentsAndScores = async () => {
            setLoading(true);
            try {
                const response = await API.get(endpoints['get_list_student'](classStudyId));
                setStudents(response.data.map(student => ({
                    ...student,
                    scores: new Array(scoreColumns.length).fill(''),
                })));

                // Lấy điểm từ API và cập nhật state apiScores
                const scoresResponse = await API.get(endpoints['get_scores'](classStudyId));
                setApiScores(scoresResponse.data);
            } catch (ex) {
                console.error("lỗi ", ex);
            } finally {
                setLoading(false);
            }
        }
        fetchStudentsAndScores();
    }, [classStudyId]);


    // thực hiện thêm cột điểm 
    const handleAddColumn = () => {
        if (scoreColumns.length < 5) {
            const newColumn = { column_name: '', scores: students.map(() => '') };
            setScoreColumns([...scoreColumns, newColumn]);
            setStudents(students.map(student => ({
                ...student,
                scores: [...student.scores, ''], // Thêm giá trị điểm rỗng cho cột mới của mỗi sinh viên
            })));
        } else {
            Alert.alert('Thông báo', 'Khóa học chỉ cho phép giáo viên thêm tối đa 5 cột điểm!');
        }
    };

    const handleColumnNameChange = (columnIndex, value) => {
        const updatedColumns = [...scoreColumns];
        updatedColumns[columnIndex].column_name = value;
        setScoreColumns(updatedColumns);
    };


    const handleChangeScore = (studentId, columnIndex, value) => {
        if (value.length > 3) {
            return; // Không cập nhật nếu độ dài vượt quá 3
        }
        let formattedValue = value.replace(/[^0-9.]/g, '');
        // Giới hạn độ dài của chuỗi là 3
        formattedValue = formattedValue.slice(0, 3);
        setStudents(students.map(student =>
            student.id === studentId ? {
                ...student,
                scores: student.scores.map((score, idx) => idx === columnIndex ? value : score),
            } : student,
        ));
    };

    // thực hiện chức năng lưu điểm
    const handleSubmit = async () => {
        const formattedData = students.map(student => {
            const scoresData = {
                student_id: student.id, // Đảm bảo sử dụng đúng trường ID của sinh viên
                midterm_score: parseFloat(student.scores[0]) || 0, // Chỉ định rõ ràng đây là điểm giữa kỳ
                final_score: parseFloat(student.scores[1]) || 0, // Chỉ định rõ ràng đây là điểm cuối kỳ
                score_columns: []
            };
            // Lặp qua các cột điểm bổ sung từ thứ 2 trở đi
            for (let i = 2; i < student.scores.length; i++) {
                scoresData.score_columns.push({
                    column_name: scoreColumns[i].column_name, // Lấy tên cột điểm từ mảng scoreColumns
                    score: parseFloat(student.scores[i]) || 0 // Chuyển đổi điểm số sang dạng số và sử dụng 0 nếu không hợp lệ
                });
            }
            return scoresData;
        });
        // console.log('Sending data:', JSON.stringify({ scores: formattedData }));
        try {
            let token = await AsyncStorage.getItem('access_token');
            let res = await authApi(token).post(endpoints['add_scores'](classStudyId), { scores: formattedData });
            Alert.alert('Success', 'Scores submitted successfully');
        } catch (error) {
            console.error(error)
            Alert.alert('Error', error.message);
        }
    };
    // thực hiện chức năng khóa điểm
    const lockScores = async () => {
        try {
            console.log(endpoints['lock_scores'](classStudyId));
            let token = await AsyncStorage.getItem('access_token');
            let res = await authApi(token).post(endpoints['lock_scores'](classStudyId), { active: 'false' });
            Alert.alert('Success', 'Đã khóa điểm!');
        } catch (error) {
            console.error(error)
            Alert.alert('Error', error.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Danh Sách Sinh Viên</Text>
            <Button style={styles.btnAddScore} title="Thêm cột điểm" onPress={handleAddColumn} />

            {scoreColumns.map((column, columnIndex) => (
                <TextInput
                    key={columnIndex}
                    style={styles.input}
                    value={column.column_name}
                    onChangeText={(value) => handleColumnNameChange(columnIndex, value)}
                    placeholder={`Nhập tên cột số ${columnIndex + 1}`}
                />
            ))}
            {students.map((student, index) => (
                <View key={student.id} style={styles.studentContainer}>
                    <Text style={InputScoreStyles.nameStudent}>{`${student.first_name} ${student.last_name}`}</Text>
                    {student.results.map((result, resultIndex) => (
                        <View key={resultIndex}>
                            <TextInput
                                style={styles.input}
                                value={result.midterm_score.toString()} // Hiển thị điểm giữa kỳ
                                onChangeText={(value) => handleChangeScore(student.id, 0, value)}
                                placeholder="Điểm giữa kỳ"
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={styles.input}
                                value={result.final_score.toString()} // Hiển thị điểm cuối kỳ
                                onChangeText={(value) => handleChangeScore(student.id, 1, value)}
                                placeholder="Điểm cuối kỳ"
                                keyboardType="numeric"
                            />
                            {result.score_columns.map((column, columnIndex) => (
                                <TextInput
                                    key={columnIndex}
                                    style={styles.input}
                                    value={column.score.toString()} // Hiển thị điểm của các cột điểm bổ sung
                                    onChangeText={(value) => handleChangeScore(student.id, columnIndex + 2, value)}
                                    placeholder={column.name_column}
                                    keyboardType="numeric"
                                />
                            ))}
                        </View>
                    ))}
                </View>
            ))}
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={InputScoreStyles.Txt_But}>Lưu thay đổi</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={lockScores} style={styles.submitButton}>
                <Text style={InputScoreStyles.Txt_But}>Khóa điểm</Text>
            </TouchableOpacity>
        </ScrollView >
    );
}

const styles = StyleSheet.create({

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    container: {
        paddingLeft: 50,
        paddingRight: 50,
    },
    studentContainer: { marginBottom: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
    submitButton: { backgroundColor: 'blue', padding: 10, marginTop: 20, alignItems: 'center' },
    btnAddScore: {
        marginBottom: 20,
    },
});
