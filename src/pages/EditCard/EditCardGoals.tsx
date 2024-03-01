import { Box, Button, Card, NumberInput, SegmentedControl, TextInput, Textarea, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { v4 as uuid } from 'uuid';
import { ICard } from "../../models";

function EditCardGoals({ form }: {
    form: UseFormReturnType<Partial<ICard>, (values: Partial<ICard>) => Partial<ICard>>
}) {
    const handleAddGoal = () => {
        if (!form.values.goals) return;
        form.setValues({
            goals: [
                ...form.values.goals,
                { 
                    id: uuid(), 
                    name: '', 
                    description: '', 
                    reward: 0, 
                    spendRequired: 0, 
                    goalType: 'SINGLE',
                    goalConfig: {
                        goalStartDate: form.values.openDate ? form.values.openDate : null,
                        goalEndDate: null
                    },
                }
            ]
        })
    }

    const handleDeleteGoal = (goalId: string) => {
        form.setValues({
            goals: form.values.goals?.filter(goal => goal.id !== goalId)
        })
    }

    const handleChangeGoalType = (id: string, value: string) => {
        const findGoalIndex = (form.values.goals || []).findIndex(goal => goal.id === id);
        if (findGoalIndex < 0) return;

        const updatedGoals = form.values.goals || [];
        updatedGoals[findGoalIndex] = {
            ...updatedGoals[findGoalIndex],
            goalType: value as 'SINGLE' | 'REPEATED',
            goalConfig: value === 'SINGLE' ? {
                goalStartDate: null,
                goalEndDate: null,
            } : {
                goalStartDate: null,
                repeatType: 'monthly',
                numRepeats: 1
            }
        }

        form.setValues({
            goals: updatedGoals
        })
    }

    return (
        <Box mb="lg">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Title order={5} w="100px">Goals</Title>
                <Button onClick={handleAddGoal} ml="20" size="compact-xs" rightSection={<IconPlus />}>Add</Button>
            </Box>
            <Box mt="lg" style={{ display: 'flex', overflowX: 'auto' }}>
                {(form.values.goals || []).map((goal, index) => {
                    const formType = (form.values.goals || [])[index].goalType;

                    return (
                        <Card miw="400px" m="xs" key={goal.id}>
                            <TextInput mb="xs" label="Name" placeholder="bonus points for spend" {...form.getInputProps(`goals.${index}.name`)} />
                            <Textarea mb="xs" label="Description" placeholder="Description" {...form.getInputProps(`goals.${index}.description`)} />
                            <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <NumberInput w="48%" mb="xs" label="Reward" placeholder="reward" {...form.getInputProps(`goals.${index}.reward`)} />
                                <NumberInput w="48%" mb="xs" label="Spend required" placeholder="Spend required" {...form.getInputProps(`goals.${index}.spendRequired`)} />
                            </Box>
                            <SegmentedControl onChange={(data) => handleChangeGoalType(goal.id, data)} mb="xs" value={goal.goalType} data={["SINGLE", "REPEATED"]} />
                            <DatePickerInput clearable placeholder="Feb 01 2021" label="Goal start date" mb="xs" {...form.getInputProps(`goals.${index}.goalConfig.goalStartDate`)} />
                            {formType === 'SINGLE' ? (
                                <DatePickerInput clearable placeholder="Dec 13 2023" label="Goal end date" mb="xs" {...form.getInputProps(`goals.${index}.goalConfig.goalEndDate`)} />
                            ) : (
                                <NumberInput label="Number of repeats" placeholder="meet this goal every month for x months" mb="xs" {...form.getInputProps(`goals.${index}.goalConfig.numRepeats`)} />
                            )}
                            <Button onClick={() => handleDeleteGoal(goal.id)} fullWidth c="red" variant="subtle">Delete</Button>
                        </Card>
                    )
                })}
            </Box>
        </Box>
    )
}

export default EditCardGoals