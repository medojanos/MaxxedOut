// React
import { View, Text, Pressable, Modal, StyleSheet} from "react-native";
import { FlatList, ScrollView } from "react-native-web";
import { useState, useEffect, useContext } from "react";

// Misc

import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const LogModalStyle = StyleSheet.create({

})

export default function LogModal({visible, Close, workout, status}) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>{workout?.name || status}</Text>
                    <ScrollView>
                        {
                            workout?.workout.map((exercise, index) => (
                                <View key={`${exercise.id}${index}`} style={MainStyle.container}>
                                    <Text style={MainStyle.containerTitle}>{exercise.name}</Text>
                                    <View style={MainStyle.inlineContainer}>
                                        <Text style={MainStyle.lightText}>Kg: {exercise.weight}</Text>
                                        <Text style={MainStyle.lightText}>Rep: {exercise.rep}</Text>
                                    </View>
                                </View>
                            )
                        )}
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