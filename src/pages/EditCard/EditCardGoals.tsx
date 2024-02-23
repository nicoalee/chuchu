import { UseFormReturnType } from "@mantine/form"
import { ICard } from "../../models"
import { Box, Title, Button, Card, TextInput, Textarea, Text } from "@mantine/core"
import { IconPlus } from "@tabler/icons-react"

function EditCardGoals({ form }: {
    form: UseFormReturnType<Partial<ICard>, (values: Partial<ICard>) => Partial<ICard>>
}) {
    const handleAddEarnRate = () => {
        
    }

    const handleDeleteGoal = (goalId: string) => {
        form.setValues({
            goals: form.values.goals?.filter(goal => goal.id !== goalId)
        })
    }

    return (
        <Box mb="lg">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Title order={5} w="100px">Goals</Title>
                <Button onClick={handleAddEarnRate} ml="20" size="compact-xs" rightSection={<IconPlus />}>Add</Button>
            </Box>
            <Box mt="lg" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {(form.values.earnRates || []).map((earnRate, index) => (
                    <Card m="xs" key={earnRate.id}>

                    </Card>
                ))}
            </Box>
        </Box>
    )
}

export default EditCardGoals