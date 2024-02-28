import { Box, Button, InputLabel, Modal, NumberInput, SegmentedControl, Select, Skeleton, TextInput } from "@mantine/core";
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { budgetId } from "../../configs";
import { COMPANIES, ECardType } from "../../constants";
import useGetAccountById from "../../hooks/useGetAccountById";

function CreateCardInFirebaseModal({
    accountId,
    opened,
    onSubmit,
    onClose
}: {
    accountId: string,
    opened: boolean;
    onClose: () => void;
    onSubmit: (
        name: string,
        description: string,
        openDate: string,
        creditLimit: number,
        cardType: ECardType,
        budgetId: string,
        companyId: string
    ) => void
}) {
    const { isLoading, data } = useGetAccountById(budgetId || '', accountId);

    const form = useForm<{ description: string, openDate: Date | null, creditLimit: number, cardType: ECardType, companyId: string }>({
        initialValues: {
            description: '',
            openDate: null,
            creditLimit: 0,
            cardType: ECardType.POINTS,
            companyId: ''
        },
        validate: {
            openDate: val =>( val ? null : 'Start Date is required'),
            creditLimit: val => (val > 0 ? null : 'Credit limit is required'),  
            companyId: val => (val ? null : 'Company is required'),
        }
    })

    const handleSubmit = () => {
        if (!budgetId) return;

        onSubmit(
            data?.name || '',
            form.values.description,
            (form.values.openDate as Date).toISOString(),
            form.values.creditLimit,
            form.values.cardType,
            budgetId,
            form.values.companyId
        )
    }

    return (
        <Modal title="Add card details" opened={opened} onClose={onClose}>
            {isLoading ? (
                <Box>
                    <Skeleton mb="xs" height={20} />
                    <Skeleton mb="xs" height={20} />
                    <Skeleton height={20} />
                </Box>
            ) : (
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Box>
                        <Select mt="xs" placeholder="Company" label="Company" data={COMPANIES.map((company) => ({ label: company.name, value: company.id }))} {...form.getInputProps('companyId')} />
                        <InputLabel mt="xs">Card Type</InputLabel>
                        <SegmentedControl fullWidth data={[ ECardType.CASHBACK, ECardType.POINTS ]} {...form.getInputProps('cardType')} />
                        <TextInput mt="md" name="description" label="Description" placeholder="what is this card for?" {...form.getInputProps('description')} />
                        <NumberInput required mt="md" name="creditLimit" label="Credit Limit" placeholder="Credit Limit" {...form.getInputProps('creditLimit')} />
                        <DatePickerInput mt="md" required label="Card open date" placeholder="Card open date" name="openDate" { ...form.getInputProps('openDate') } />
                    </Box>
                    <Box mt="xl">
                        <Button type="submit" fullWidth>Confirm</Button>
                        <Button onClick={() => onClose()} variant="transparent" c="red" fullWidth mt="md">Cancel</Button>
                    </Box>
                </form>
            )}
        </Modal>
    )
}

export default CreateCardInFirebaseModal