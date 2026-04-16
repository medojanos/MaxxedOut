// React
import { View, ScrollView, Text, Pressable, TextInput, Modal } from "react-native";
import { useContext, useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import dayjs from "dayjs";

// Misc
import { Context} from "../../misc/Provider";
import Loader from "../../components/Loader";
import ExerciseInfoModal from "../../components/modals/ExerciseInfoModal";
import SaveModal from "../../components/modals/SaveModal";
import CancelModal from "../../components/modals/CancelModal";
import ReArrange from "../../components/ReArrange";
import AddExercise from "../../components/AddExercise";
import Constants from 'expo-constants';

// Style
import * as Var from "../../style/Variables"
import MainStyle from "../../style/MainStyle"
import KeyboardView from "../../components/KeyboardView";
import ModalOverlay from "../../components/ModalOverlay";

export default function Workout() {
    const {token, workout, setWorkout} = useContext(Context);

    const [cancelModal, setCancelModal] = useState(false);
    const [searchModal, setSearchModal] = useState(false);
    const [doneModal, setDoneModal] = useState(false);
    const [recentModal, setRecentModal] = useState(false);
    const [status, setStatus] = useState();

    useEffect(() => {
        if (!status) return;
        setTimeout(() => setStatus(""), 3000);
    }, [status]);

    if (!workout) return <Loader/>

    function addExercise(id, name) {
        if (workout.plan.some(ex => ex.name === name)) return setStatus("Duplicate exercise name");
        setWorkout(prev => ({
                ...prev,
                ownIndex: typeof id == "string" ? prev.ownIndex + 1 : prev.ownIndex,
                plan: [
                    ...prev.plan, 
                    {
                        id: id,
                        name: name,
                        sets: [{ weight: "", rep: ""}]
                    }
                ]
            }));
        setSearchModal(false);
    }

    function updateExercise(exerciseIndex, setIndex, prop, value) {
        setWorkout(prev => ({
            ...prev,
            plan: Array.from(prev.plan, (ex, exi) => {
                if(exerciseIndex == exi){
                    return {...ex, sets: Array.from(ex.sets, (set, seti) => {
                        if (setIndex == seti){
                            switch(prop){
                                case "weight":
                                    return {...set, weight: value}
                                case "rep":
                                    return {...set, rep: value}
                            }  
                        }
                        else return set
                    })}
                } else return ex
            })
        }))
    }

    function updateExerciseName(exerciseIndex, text) {
        if (workout.plan.some(ex => ex.name === text)) return setStatus("Duplicate exercise name");
        setWorkout(prev => ({
            ...prev,
            plan : prev.plan.map((ex, exi) => {
                if (exerciseIndex == exi) return {...ex, name : text}
                return ex;
            })
        }))
    }

    function deleteExercise(exerciseIndex) {
        setWorkout(prev => ({...prev, plan : prev.plan.filter((_, index) => exerciseIndex != index)}))
    }

    function addSet(exerciseIndex) {
        setWorkout(prev => ({
            ...prev,
            plan: prev.plan.map((ex, exi) => {
                if (exerciseIndex == exi) return {
                    ...ex,
                    sets: [...ex.sets, { weight: "", rep: "" }]
                }
                else return ex;
            })
        }))
    }

    function deleteSet(exerciseIndex, setIndex) {
        setWorkout(prev => ({
            ...prev,
            plan: prev.plan.map((ex, exi) => {
                if (exerciseIndex == exi) return {
                    ...ex,
                    sets: ex.sets.filter((_, seti) => setIndex != seti)
                }
                else return ex;
            })
        }));
    }

    return (
        <KeyboardView>
            <ScrollView contentContainerStyle={MainStyle.content}>
                {status ? <Text style={MainStyle.lightText}>{status}</Text> : null}
                {workout.id ? 
                    <Pressable
                        style={MainStyle.secondaryButton}
                        onPress={() => {
                            fetch(Constants.expoConfig.extra.API_URL + "/workouts?name=" + encodeURIComponent(workout.name), { headers: { Authorization: token } })
                            .then(res => res.json()
                            .then(data => {
                                if (res.ok) {
                                    setWorkout(prev => ({
                                        ...prev, 
                                        plan: prev.plan.map(ex => {
                                            const recentEx = data.data.find(r => r.name === ex.name);
                                            return recentEx ? {...ex, sets: Array.from(recentEx.sets, set => ({weight: set.weight == 0 ? "" : set.weight.toString(), rep: set.rep == 0 ? "" : set.rep.toString()}))} : ex
                                        })
                                    }))
                                }
                                else {
                                    setRecentModal(true);
                                }
                            }))
                        }}>
                        <Text style={MainStyle.buttonText}>Import recent</Text>
                    </Pressable>
                    :
                    <TextInput 
                        style={MainStyle.input} 
                        value={workout.name} 
                        onChangeText={text => {
                            setWorkout({...workout, name: text});
                            setStatus();
                        }}>
                    </TextInput>
                }
                
                <ModalOverlay visible={recentModal}>
                    <Text style={MainStyle.screenTitle}>No recent workout</Text>
                    <Pressable style={MainStyle.button} onPress={() => setRecentModal(false)}>
                        <Text style={MainStyle.buttonText}>Close</Text>
                    </Pressable>
                </ModalOverlay>

                {workout.plan?.map((exercise, exerciseIndex) => (
                    <View key={exerciseIndex} style={MainStyle.container}>
                        <View style={MainStyle.inlineContainer}>
                            <ReArrange
                                index={exerciseIndex}
                                list={workout.plan}
                                onMove={newList => setWorkout(prev => ({...prev, plan : newList}))}>
                            </ReArrange>
                            {
                            typeof exercise.id == "string" || exercise.id === null ? 
                            <TextInput
                                style={[MainStyle.input, {flexGrow: 1, maxWidth: "80%"}]}
                                value={exercise.name || ""}
                                onChangeText={text => updateExerciseName(exerciseIndex, text)}>
                            </TextInput>
                            : 
                            <ExerciseInfoModal
                                id={exercise.id}
                                name={exercise.name}
                                maxWidth={"80%"}
                            />
                            }
                            <View>
                                <Pressable onPress={() => deleteExercise(exerciseIndex)}>
                                    <Ionicons name="trash" color={Var.red} size={30}></Ionicons>
                                </Pressable>
                            </View>
                        </View>
                        {
                            exercise.sets?.map((_, setIndex) => (
                                <View key={setIndex} style={MainStyle.inlineContainer}>            
                                    <Text style={MainStyle.lightText}>{setIndex+1 + "."}</Text>
                                    <TextInput 
                                        value={workout.plan[exerciseIndex].sets[setIndex].weight.toString()}
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="kg"
                                        onChangeText={text => { 
                                            if (text == "" || /^\d+([.,]\d*)?$/.test(text)) updateExercise(exerciseIndex, setIndex, "weight", text) 
                                        }}
                                    />
                                    <Text style={MainStyle.lightText}>x</Text>
                                    <TextInput 
                                        value={workout.plan[exerciseIndex].sets[setIndex].rep.toString()}
                                        keyboardType="numeric"
                                        style={[MainStyle.input, MainStyle.setInput]}
                                        placeholder="rep"
                                        onChangeText={text => { 
                                            if (text == "" || /^\d*$/.test(text)) updateExercise(exerciseIndex, setIndex, "rep", text) 
                                        }}
                                    />
                                    <Pressable onPress={() => deleteSet(exerciseIndex, setIndex)}>
                                        <Ionicons name="close" color={Var.paleWhite} size={30}></Ionicons>
                                    </Pressable>
                                </View>
                            ))
                        }
                        <Pressable onPress={() => addSet(exerciseIndex)}>
                            <Ionicons name="add-circle-outline" color={Var.red} size={25} style={{margin: "auto"}}></Ionicons>
                        </Pressable>
                    </View>
                ))}

                <AddExercise
                    visible={searchModal}
                    addExercise={addExercise}
                    ownIndex={workout.ownIndex}
                    Close={() => setSearchModal(false)}
                /> 
                <Pressable style={MainStyle.button} onPress={() => setSearchModal(true)}>
                    <Text style={MainStyle.buttonText}>Add exercise</Text>
                </Pressable>
                <View style={MainStyle.inlineContainer}>
                    <Pressable style={[MainStyle.button, MainStyle.buttonBlock]} onPress={() => setDoneModal(true)}>
                        <Text style={MainStyle.buttonText}>Done</Text>
                    </Pressable>
                    <Pressable style={[MainStyle.secondaryButton, MainStyle.buttonBlock]} onPress={() => setCancelModal(true)}>
                        <Text style={MainStyle.buttonText}>Cancel</Text>
                    </Pressable>
                </View>

                <SaveModal
                    saveModal={doneModal}
                    setSaveModal={setDoneModal}
                    setWorkout={setWorkout}
                    body={{
                        name: workout.name,
                        plan: workout.plan,
                        started_at: workout.started_at,
                        ended_at: dayjs().format("YYYY-MM-DD HH:mm:ss")
                    }}
                    token={token}
                    setStatus={setStatus}/>
                <CancelModal
                    cancelModal={cancelModal}
                    setCancelModal={setCancelModal}
                    setWorkout={setWorkout}/>
            </ScrollView>
        </KeyboardView>
    );
}
