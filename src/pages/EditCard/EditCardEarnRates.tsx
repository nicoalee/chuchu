import { Box, Button, Card, Text, TextInput, Textarea, Title } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { v4 as uuid } from 'uuid';
import { ICard } from "../../models";

function EditCardEarnRates({ form }: {
    form: UseFormReturnType<Partial<ICard>, (values: Partial<ICard>) => Partial<ICard>>
}) {

    const handleAddEarnRate = () => {
        if (!form.values.earnRates) return;
        form.setValues({
            earnRates: [
                ...form.values.earnRates,
                { id: uuid(), name: '', description: '' }
            ]
        })
    }

    const handleDeleteEarnRate = (earnRateId: string) => {
        form.setValues({
            earnRates: form.values.earnRates?.filter(earnRate => earnRate.id !== earnRateId)
        })
    }

    return (
        <Box>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Title order={5} w="100px">Earn Rates</Title>
                <Button onClick={handleAddEarnRate} ml="20" size="compact-xs" rightSection={<IconPlus />}>Add</Button>
            </Box>
            <Text mt="xs" size="xs">Note: this section has no effect on your goals and only serves as a reminder of the earn rates for your credit card</Text>
            <Box mt="lg" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {(form.values.earnRates || []).map((earnRate, index) => (
                    <Card m="xs" key={earnRate.id}>
                        <TextInput mb="xs" placeholder="1.5 points per $1" {...form.getInputProps(`earnRates.${index}.name`)} />
                        <Textarea mb="xs" placeholder="groceries and gas" {...form.getInputProps(`earnRates.${index}.description`)} />
                        <Button onClick={() => handleDeleteEarnRate(earnRate.id)} fullWidth c="red" variant="subtle">Delete</Button>
                    </Card>
                ))}
            </Box>
        </Box>
    )
}

export default EditCardEarnRates