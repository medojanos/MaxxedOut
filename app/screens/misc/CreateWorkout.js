import { View, Text, ScrollView, Pressable } from "react-native";

import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import { StyleSheet } from "react-native";
const WorkoutStyle = StyleSheet.create({

})

export default function CreateWorkout() {
    const [planName, setPlanName] = useState();
        const [exercises, setExercises] = useState();
        useEffect(() => {
            fetch("http://localhost:4000/exercises", {
                method: "GET",
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            .then(res => res.json())
            .then(data => setExercises(data))
        },[])
    return (
        <ScrollView contentContainerStyle={MainStyle.content}>
            <View>
                <TextInput placeholder="Enter workout name" style={MainStyle.input} onChangeText={setPlanName}></TextInput>
                                    <FlatList
                                        data={exercises}
                                        renderItem={({item}) => <Text style={MainStyle.lightText}>{item.name}</Text>}>
                                    </FlatList>
                                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
            </View>
        </ScrollView>
    );
}