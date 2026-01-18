import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useEffect, useContext } from 'react';

// Misc
import AddExercise from './AddExercise';
import { Context } from '../misc/Provider';
import ExerciseInfoModal from './ExerciseInfoModal';

// Style
import * as Var from '../style/Variables';
import MainStyle from '../style/MainStyle';
import { View } from 'react-native';

export default function ReArrange({index, list, onMove}) {
    function Move(from, to) {
        if (to < 0 || to >= list.length) return;
        const newList = [...list];
        const item = newList[from];
        newList.splice(from, 1);
        newList.splice(to, 0, item);
        onMove(newList);
    }
    return (
        <View style={{marginRight: 10}}>
            <Ionicons name="chevron-up" color={Var.white} size={20} onPress={() => Move(index, index-1)}></Ionicons>
            <Ionicons name="chevron-down" color={Var.white} size={20} onPress={() => Move(index, index+1)}></Ionicons>
        </View>
    )
}