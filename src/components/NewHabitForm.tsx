import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";

const availableWeekDays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

function NewHabitForm() {
  const [title, setTitle] = useState("");
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [empty, setempty] = useState(false)

  async function createNewHabit(event: FormEvent) {
    event.preventDefault();
    if(!title || weekDays.length === 0){
        setempty(true)
        return
    }

    setempty(false)

    await api.post("habits", {
      title,
      weekDays,
    });

    setTitle("");
    setWeekDays([]);
    alert("habito criado com sucesso!");
  }

  // percorre a lista e ver se o dia já está la dentro
  function handleToggleWeekDay(weekDay: number) {
    if (weekDays.includes(weekDay)) {
      const weekDaysWithRemovedOne = weekDays.filter((day) => day != weekDay);

      setWeekDays(weekDaysWithRemovedOne);
    } else {
      const weekDaysWithAddedOne = [...weekDays, weekDay];
      setWeekDays(weekDaysWithAddedOne);
    }
  }

  return (
    <>
      <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6 ">
        <label htmlFor="title" className="font-semibold leading-tight">
          Qual seu comprometimento?
        </label>
        <input
          type="text"
          id="title"
          placeholder="Exercicios, tarefa de casa, etc..."
          className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          autoFocus
        />
        <label htmlFor="" className="font-semibold leading-tight mt-4">
          Qual a recorrência?
        </label>

        <div className="flex flex-col gap-3 mt-3">
          {availableWeekDays.map((weekDay, index) => {
            return (
              <Checkbox.Root
                key={weekDay}
                className="flex items-center gap-3 group"
                checked={weekDays.includes(index)}
                onCheckedChange={() => {
                  handleToggleWeekDay(index);
                }}
              >
                <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500">
                  <Checkbox.Indicator>
                    <Check size={20} className="text-white" />
                  </Checkbox.Indicator>
                </div>
                <span className="leading-tight">{weekDay}</span>
              </Checkbox.Root>
            );
          })}
        </div>

        <button
          type="submit"
          className="my-6  rounded-lg p-3 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 "
        >
          <Check size={20} weight={"bold"} />
          Confirmar
        </button>
      </form>
      <div>
        {empty && <span className="text-red-500 font-semibold  flex justify-center">Please, add a habit and select the days!!!</span>}
      </div>
    </>
  );
}

export default NewHabitForm;
