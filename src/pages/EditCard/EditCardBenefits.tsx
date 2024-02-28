import { Box, Button, Card, Checkbox, NumberInput, Switch, Text, TextInput, Textarea, Title } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import { v4 as uuid } from 'uuid';
import { ICard } from "../../models";

function EditCardBenefits({ form }: {
    form: UseFormReturnType<Partial<ICard>, (values: Partial<ICard>) => Partial<ICard>>
}) {

    const handleAddBenefit = () => {
        if (!form.values.earnRates) return;
        form.setValues({
            benefits: [
                ...(form.values.benefits || []),
                {
                    id: uuid(),
                    isRedeemable: false,
                    name: '',
                    description: '',
                    redemptions: [],
                    numAllowedRedemptions: 0,
                    numMonthsAllowedRedemptionsReset: 0,
                    noReset: false
                }
            ]
        })
    }

    const handleDeleteBenefit = (benefitToDeleteId: string) => {
        form.setValues({
            benefits: form.values.benefits?.filter(benefit => benefit.id !== benefitToDeleteId)
        })
    }

    return (
        <Box mb="lg">
            <Box style={{ display: 'flex', alignItems: 'center' }}>
                <Title order={5} w="100px">Benefits</Title>
                <Button onClick={handleAddBenefit} ml="20" size="compact-xs" rightSection={<IconPlus />}>Add</Button>
            </Box>
            <Text mt="xs" size="xs">Note: this section has no effect on your goals and only serves as a reminder of the benefits for your credit card</Text>
            <Box mt="lg" style={{ display: 'flex', overflowX: 'auto' }}>
                {(form.values.benefits || []).map((benefit, index) => (
                    <Card miw="300px" m="xs" key={benefit.id}>
                        <TextInput label="Name" placeholder="free checked baggage" {...form.getInputProps(`benefits.${index}.name`)} />
                        <Textarea label="Description" mt="xs" placeholder="free checked bags for all air canada flights" {...form.getInputProps(`benefits.${index}.description`)} />
                        <Switch mt="lg" mb="xs" label="isRedeemable" {...form.getInputProps(`benefits.${index}.isRedeemable`)} />
                        {benefit.isRedeemable && (
                            <>
                                <NumberInput label="Number of Allowed Uses" {...form.getInputProps(`benefits.${index}.numAllowedRedemptions`)} />
                                {!benefit.noReset && (
                                    <NumberInput mt="lg" label="Number of Months Until Reset" {...form.getInputProps(`benefits.${index}.numMonthsAllowedRedemptionsReset`)} />
                                )}
                                <Checkbox mt="xs" label="This benefit does not reset" {...form.getInputProps(`benefits.${index}.noReset`)} />
                            </>
                        )}
                        <Button style={{ marginTop: 'auto' }} variant="subtle" c="red" onClick={() => handleDeleteBenefit(benefit.id)}>Delete</Button>
                    </Card>
                ))}
            </Box>
        </Box>
    )
}

export default EditCardBenefits