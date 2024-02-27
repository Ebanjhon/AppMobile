

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';

export default function App() {
    const [students, setStudents] = useState([]);
    const [scoreColumns, setScoreColumns] = useState([
        { column_name: 'midterm_score', scores: [] },
        { column_name: 'final_score', scores: [] },
    ]);


    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('https://nmau4669.pythonanywhere.com/StudyClass/5/get_sudents/');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setStudents(data.map(student => ({
                    ...student,
                    scores: new Array(scoreColumns.length).fill(''), // Khởi tạo mỗi sinh viên với số lượng điểm tương ứng với số cột
                })));
            } catch (error) {
                Alert.alert('Error', error.message);
            }
        };

        fetchStudents();
    }, []); // Không phụ thuộc vào scoreColumns vì chúng ta khởi tạo sẵn 2 cột điểm

    const handleAddColumn = () => {
        if (scoreColumns.length < 7) {
            const newColumn = { column_name: '', scores: students.map(() => '') };
            setScoreColumns([...scoreColumns, newColumn]);
            setStudents(students.map(student => ({
                ...student,
                scores: [...student.scores, ''], // Thêm giá trị điểm rỗng cho cột mới của mỗi sinh viên
            })));
        } else {
            Alert.alert('Lỗi ', 'You can only add up to 5 score columns.');
        }
    };

    const handleColumnNameChange = (columnIndex, value) => {
        const updatedColumns = [...scoreColumns];
        updatedColumns[columnIndex].column_name = value;
        setScoreColumns(updatedColumns);
    };

    const handleChangeScore = (studentId, columnIndex, value) => {
        setStudents(students.map(student =>
            student.id === studentId ? {
                ...student,
                scores: student.scores.map((score, idx) => idx === columnIndex ? value : score),
            } : student,
        ));
    };



    const handleSubmit = async () => {
        // Tạo dữ liệu theo định dạng yêu cầu
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

        console.log('Sending data:', JSON.stringify({ scores: formattedData }));

        try {
            const response = await fetch('https://nmau4669.pythonanywhere.com/StudyClass/5/input_scores/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ scores: formattedData }),
            });

            if (!response.ok) throw new Error('Something went wrong!');
            const responseData = await response.json();
            Alert.alert('Success', 'Scores submitted successfully');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Danh Sách Sinh Viên</Text>



            <Button style={styles.btnAddScore} title="Add Score Column" onPress={handleAddColumn} />


            {scoreColumns.map((column, columnIndex) => (
                <TextInput
                    key={columnIndex}
                    style={styles.input}
                    value={column.column_name}
                    onChangeText={(value) => handleColumnNameChange(columnIndex, value)}
                    placeholder={`Column Name ${columnIndex + 1}`}
                />
            ))}
            {students.map((student, index) => (
                <View key={student.id} style={styles.studentContainer}>
                    <Text>{`${student.first_name} ${student.last_name}`}</Text>
                    {student.scores.map((score, columnIndex) => (
                        <TextInput
                            key={columnIndex}
                            style={styles.input}
                            value={score}
                            onChangeText={(value) => handleChangeScore(student.id, columnIndex, value)}
                            placeholder={scoreColumns[columnIndex]?.column_name || `Score ${columnIndex + 1}`}
                        />
                    ))}
                </View>
            ))}
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text>Submit Scores</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    container: { padding: 50 },
    studentContainer: { marginBottom: 20 },
    input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 },
    submitButton: { backgroundColor: 'lightblue', padding: 10, marginTop: 20, alignItems: 'center' },
    btnAddScore: {
        marginBottom: 20,
    },
});
