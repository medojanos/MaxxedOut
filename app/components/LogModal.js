// React
import { View, Text, Pressable, Modal, StyleSheet} from "react-native";
import { ScrollView } from "react-native";

// Misc
import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const LogModalStyle = StyleSheet.create({
    
})

export default function LogModal({visible, Close, workouts, status}) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={[MainStyle.modal, LogModalStyle.modal]}>
                    <ScrollView>
                        {workouts ? workouts.map(workout => (
                            <View key={workout.id}>
                                <Text style={MainStyle.screenTitle}>{workout.name}</Text>
                                {workout.exercises.map((exercise, exerciseIndex) => (
                                    <View key={exerciseIndex} style={MainStyle.container}>
                                        <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                                        {exercise.sets.map((_, setIndex) => (
                                            <View key={setIndex} style={MainStyle.inlineContainer}>
                                                <Text style={MainStyle.lightText}>Kg: {exercise.sets[setIndex].weight} </Text>
                                                <Text style={MainStyle.lightText}>Rep: {exercise.sets[setIndex].rep} </Text>
                                            </View>
                                        ))}
                                    </View>
                                    ))
                                }
                            </View> 
                        )) : <Text style={MainStyle.containerTitle}>{status}</Text>}
                    </ScrollView>
                    <Pressable
                        style={MainStyle.button}
                        onPress={() => Close()}>
                        <Text style={MainStyle.buttonText}>Close</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}