// React
import { View, Text, Pressable} from "react-native";
import { useContext, useEffect, useState } from "react";

// Misc
import { Context } from "../../misc/Provider";
import Constants from 'expo-constants';
import ModalOverlay from "../ModalOverlay";

// Style
import MainStyle from "../../style/MainStyle"


export default function ExerciseInfoModal({id, name, maxWidth}) {
    const [exerciseInfos, setExerciseInfos] = useState();
    const [visible, setVisible] = useState(false);

    const {token} = useContext(Context);

    useEffect(() => {
        fetch(Constants.expoConfig.extra.API_URL + "/exercises/" + id, { headers: { "Authorization": token } })
        .then(res => res.json())
        .then(data => setExerciseInfos(data.data))
    }, [id, token]);

    return (
        <>
            <Pressable 
                style={{flexGrow: 1, maxWidth: maxWidth || "100%"}}
                onPress={() => setVisible(true)}>
                <Text style={MainStyle.strongText}>{name}</Text>
            </Pressable>
            <ModalOverlay visible={visible} onClose={() => setVisible(false)}>
                <Text style={MainStyle.screenTitle}>{exerciseInfos?.name}</Text>
                {exerciseInfos ? (
                    <View>
                        <Text style={MainStyle.lightText}>Type: {exerciseInfos.type}</Text>
                        {Object.entries(exerciseInfos.muscle_groups).length !== 0 ? 
                            <>
                                <Text style={[MainStyle.containerTitle, {marginVertical: 10, textAlign: "center"}]}>
                                    Muscle groups
                                </Text>
                                <View style={MainStyle.inlineContainer}>
                                    {Object.entries(exerciseInfos.muscle_groups).map(
                                        ([role, muscleGroups]) => (
                                            <View key={role}>
                                                <Text style={MainStyle.strongText}>{role}: </Text>
                                                {muscleGroups.map(mg => (
                                                    <Text style={MainStyle.lightText} key={mg}>{mg}</Text>
                                                ))}
                                            </View>
                                        )
                                    )}
                                </View> 
                            </> : null}
                    </View>
                ) : null}
                <Pressable style={MainStyle.button} onPress={() => setVisible(false)}>
                    <Text style={MainStyle.buttonText}>Close</Text>
                </Pressable>
            </ModalOverlay>
        </>
    )
}
