import { Box, Button, Modal, Textarea } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";

function AddNewRedemption({
    isOpen,
    onClose,
    onAdd,
    title
}: {
    isOpen: boolean,
    onClose: () => void,
    onAdd: (notes: string, dateRedeemed: string) => void,
    title: string,
}) {
    const form = useForm<{ notes: string, redemptionDate: Date }>({
        initialValues: {
            notes: '',
            redemptionDate: new Date()
        },
        validate: {
            redemptionDate: val => val ? null : 'Redemption Date is required'
        }
    })

    const handleSubmit = () => {
        onAdd(form.values.notes, form.values.redemptionDate.toISOString())
        form.setValues({
            notes: '',
            redemptionDate: new Date()
        })
    }

    return (
        <Modal title={title} centered opened={isOpen} onClose={onClose}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box>
                    <Textarea label="Notes" placeholder="Describe the redemption..." mb="xs" {...form.getInputProps('notes')} />
                    <DatePickerInput label="Redemption Date" placeholder="Redemption Date" mb="xs" {...form.getInputProps('redemptionDate')} />
                    <Box mt="lg">
                        <Button onClick={() => onClose()} w="50%" variant="subtle" color="red">Close</Button>
                        <Button type="submit" w="50%">Submit</Button>
                    </Box>
                </Box>
            </form>
        </Modal>
    )
}

export default AddNewRedemption;