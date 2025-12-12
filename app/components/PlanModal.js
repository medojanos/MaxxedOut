// React
import { View, Text, Pressable, Modal, StyleSheet} from "react-native";
import { FlatList } from "react-native-web";
import { useState, useEffect, useContext } from "react";

// Misc

import { Context } from "../misc/Provider";

// Style
import * as Var from "../style/Variables"
import MainStyle from "../style/MainStyle"
const PlanModalStyle = StyleSheet.create({

})

export default function PlanModal({Close, visible, id}) {
    const [plan, setPlan] = useState();
    const {token} = useContext(Context);
    useEffect(() => {
        fetch("http://localhost:4000/plan/" + id, {headers: {"Authorization" : token}})
        .then(res => res.json())
        .then(data => setPlan(data.data))
    }, [id])
    return (
        <Modal 
            animationType="fade"
            onRequestClose={() => Close()}
            transparent={true}
            visible={visible}>
            <View style={MainStyle.overlay}>
                <View style={MainStyle.modal}>
                    <Text style={MainStyle.screenTitle}>Edit workout plan</Text>
                    <FlatList
                        data={plan}
                        renderItem={({item}) => <Text style={MainStyle.lightText}>{item.name}{item.sets}</Text>}>
                    </FlatList>
                    <Pressable style={MainStyle.button} onPress={Close}><Text style={MainStyle.buttonText}>Close</Text></Pressable>
                </View>
            </View>
        </Modal>
    )
}