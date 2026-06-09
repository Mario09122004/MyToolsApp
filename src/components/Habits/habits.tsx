import { ScrollView } from "react-native-gesture-handler";
import Habit from "./habit";

export default function Habits() {
    const habits = [{
        id: 1,
        name: "Habit 1",
        check: true
    }, {
        id: 2,
        name: "Habit 2",
        check: false
    }, {
        id: 3,
        name: "Habit 3",
        check: false
    }, {
        id: 4,
        name: "Habit 4",
        check: false
    }, {
        id: 5,
        name: "Habit 5",
        check: false
    }, {
        id: 6,
        name: "Habit 6",
        check: false
    }, {
        id: 7,
        name: "Habit 7",
        check: false
    }, {
        id: 8,
        name: "Habit 8",
        check: false
    },]

    return (
        <ScrollView>
            {habits.map((habit) => (
                <Habit 
                    key={habit.id} 
                    Title={habit.name}
                    Description={"Insert description if exist"}
                    Check={habit.check}
                />
            ))}
        </ScrollView>
    );

}