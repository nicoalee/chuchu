import { Box, Button, InputLabel, Modal, NumberInput, SegmentedControl, TextInput } from "@mantine/core";
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { Notifications } from "@mantine/notifications";
import { getDatabase, ref, set } from "firebase/database";
import { ECardType } from "../../constants";
import { getFirebaseApp } from "../../configs";
import { ICard } from "../../models";
import * as ynab from 'ynab';

function CreateCardInFirebaseModal({ account, opened, onClose }: { account: ynab.Account, opened: boolean; onClose: () => void }) {
    const form = useForm<{ description: string, openDate: Date | null, creditLimit: number, cardType: ECardType }>({
        initialValues: {
            description: '',
            openDate: null,
            creditLimit: 0,
            cardType: ECardType.POINTS
        },
        validate: {
            openDate: val =>( val ? null : 'Start Date is required'),
            creditLimit: val => (val > 0 ? null : 'Credit limit is required'),  
        }
    })

    const handleSubmit = () => {
        const app = getFirebaseApp();
        const db = getDatabase(app);

        const reference = ref(db, `cards/${account.id}`);
        set(reference, {
            description: form.values.description,
            openDate: form.values.openDate?.toUTCString(),
            creditLimit: form.values.creditLimit,
            cardType: form.values.cardType,
            name: account.name,
        } as Partial<ICard>).then(() => {
            Notifications.show({
                title: 'Sucess',
                message: 'Card details saved',
                color: 'green',
            })
            onClose();
        }).catch(() => {
            Notifications.show({
                title: 'There was an error',
                message: 'Encountered an error while trying to save card details. Please contact Nick',
                color: 'red'
            })
        })
    }

    return (
        <Modal title="Add card details" opened={opened} onClose={onClose}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box>
                    <InputLabel>Card Type</InputLabel>
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
        </Modal>
    )
}

export default CreateCardInFirebaseModal