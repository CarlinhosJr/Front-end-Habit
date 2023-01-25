import * as Checkbox from "@radix-ui/react-checkbox";
import dayjs from "dayjs";
import { Check } from "phosphor-react";
import { useEffect, useState } from "react";
import { api } from "../lib/axios";

interface HabitsListProps {
  date: Date;
  onCompletedChanged: (completed: number) => void;
}

interface Habitsinfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: Date;
  }[];
  completedHabits: string;
}

function HabitsList({ date, onCompletedChanged }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<Habitsinfo>();

  useEffect(() => {
    api
      .get("day", {
        params: {
          date: date.toISOString(),
        },
      })
      .then((response) => {
        console.log(response.data);
        setHabitsInfo(response.data);
      });
  }, []);

  // função para marcar e desmarcar o habito
  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`);
    
    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId);

    let completedHabits: string[] = []

      if(isHabitAlreadyCompleted){
        // remover ele da lista
        
        completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
      }else{
        // adicionar na lista
        completedHabits = [...habitsInfo!.completedHabits, habitId]
      }

      setHabitsInfo({
        possibleHabits: habitsInfo!.possibleHabits,
        completedHabits,
      })

      onCompletedChanged(completedHabits.length)
  }

  const isDateInPast = dayjs(date).endOf("day").isBefore(new Date()); // Pegar a data colocar no final do dia 23:59:59, ai valida que é anterior (isBefore)

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        return (
          <Checkbox.Root
            key={habit.id}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            checked={habitsInfo.completedHabits.includes(habit.id)}
            disabled={isDateInPast}
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500  group-focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-bg">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="font-semibold text-xl leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        );
      })}
    </div>
  );
}

export default HabitsList;
