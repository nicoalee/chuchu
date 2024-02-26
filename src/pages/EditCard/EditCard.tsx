
import { Anchor, Box, Breadcrumbs, Button, Container, Image, NumberInput, SegmentedControl, Select, TextInput, Textarea, Title } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { Notifications } from "@mantine/notifications";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useRef } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { getFirebaseApp } from "../../configs";
import { COMPANIES, ECardType } from "../../constants";
import { ICard, ISingleGoal } from "../../models";
import EditCardBenefits from "./EditCardBenefits";
import EditCardEarnRates from "./EditCardEarnRates";
import EditCardGoals from "./EditCardGoals";

function EditCard() {
    const navigate = useNavigate();
    const initFormRef = useRef<boolean>(false);
    const { cardId } = useParams<{ cardId: string }>();

    const form = useForm<Partial<ICard>>({
        initialValues: {
            name: '',
            description: '',
            rewardsPointsName: '',
            openDate: null,
            closeDate: null,
            creditLimit: 0,
            annualFee: 0,
            companyId: undefined,
            cycleStartDate: 0,
            cycleEndDate: 0,
            cardImageUrl: '',
            cardType: ECardType.POINTS,
            benefits: [],
            goals: [],
            earnRates: [],
        },
        validate: {
            cycleStartDate: val => val ? null : 'Cycle Start Date is required',
            cycleEndDate: val => val ? null : 'Cycle End Date is required', 
            openDate: val =>( val ? null : 'Start Date is required'),
            companyId: val => val ? null : 'Company is required',
            name: val => val ? null : 'Name is required',
            benefits: {
                name: val => val ? null : 'Name is required',
                numAllowedRedemptions(value, values, path) {
                    if (!values.benefits) return null;
                    const index = path.split(".")[1]; // of the form "benefits.0.numAllowedRedemptions"
                    const isRedeemable = values.benefits[parseInt(index)].isRedeemable;
                    if (!isRedeemable) return null;
                    return value ? null : 'This is required and cannot be 0'
                },
                numMonthsAllowedRedemptionsReset(value, values, path) {
                    if (!values.benefits) return null;
                    const index = path.split(".")[1]; // of the form "benefits.0.numAllowedRedemptions"
                    const isRedeemable = values.benefits[parseInt(index)].isRedeemable;
                    const noReset = values.benefits[parseInt(index)].noReset;
                    if (!isRedeemable || noReset) return null;
                    return value ? null : 'This is required and cannot be 0'
                },
            },
            earnRates: {
                name: val => val ? null : 'Name is required',
                description: val => val ? null : 'Description is required'
            },
            goals: {
                name: val => val ? null : 'Name is required',
                goalConfig: {
                    goalStartDate: val => val ? null : 'Start Date is required',
                    goalEndDate(value, values, path) {
                        if (!values.goals) return null;
                        const goalIndex = parseInt(path.split(".")[1]);
                        const goalType = values.goals[goalIndex].goalType;
                        if (goalType === 'REPEATED') return null;
                        if (goalType === 'SINGLE') return value ? null : 'End Date is required'
                    },
                }
            }
        },
    })

    useEffect(() => {
        if (!cardId) return;

        const app = getFirebaseApp();
        const db = getDatabase(app);
        const reference = ref(db, `cards/${cardId}`)
        const unsub = onValue(reference, (snapshot) => {
            if (initFormRef.current) return;
            initFormRef.current = true;
            const snapshotVal = snapshot.val();

            const valuesFromDB: Partial<ICard> = {
                ...form.values,
                ...snapshotVal,
            };

            // convert dates from string to Date object
            valuesFromDB.openDate = valuesFromDB.openDate ? new Date(valuesFromDB.openDate) : null;
            valuesFromDB.closeDate = valuesFromDB.closeDate ? new Date(valuesFromDB.closeDate) : null;
            (valuesFromDB.goals || []).forEach((goal) => {
                goal.goalConfig.goalStartDate = goal.goalConfig.goalStartDate ? new Date(goal.goalConfig.goalStartDate) : null;
                if (goal.goalType === 'SINGLE') {
                    const singleGoalConfig = goal.goalConfig as ISingleGoal;
                    singleGoalConfig.goalEndDate = singleGoalConfig.goalEndDate ? new Date(singleGoalConfig.goalEndDate) : null;
                }
            });

            form.setValues(valuesFromDB);
        })

        return () => unsub();
    }, [cardId, form])

    const handleSubmit = () => {
        const app = getFirebaseApp();
        if (!app) {
            Notifications.show({
                title: 'No firebase app connected',
                message: 'Encountered an error while trying to save card details. Please contact Nick',
                color: 'red'
            })
            return;
        }
        const db = getDatabase(app);
        const cardRef = ref(db, `cards/${cardId}`);

        const updatedCard: Partial<ICard> = {
            ...form.values,
            openDate: (form.values.openDate as Date).toISOString(),
            closeDate: form.values.closeDate ? (form.values.closeDate as Date).toISOString() : null,
            goals: (form.values.goals || []).map((goal) => {
                const updatedGoal = { ...goal, goalConfig: { ...goal.goalConfig } };

                if (goal.goalType === 'SINGLE') {
                    const singleGoalConfig = updatedGoal.goalConfig as ISingleGoal;
                    singleGoalConfig.goalEndDate = singleGoalConfig.goalEndDate ? (singleGoalConfig.goalEndDate as Date).toISOString() : null
                }
                updatedGoal.goalConfig.goalStartDate = updatedGoal.goalConfig.goalStartDate ? (updatedGoal.goalConfig.goalStartDate as Date).toISOString() : null

                return {
                    ...updatedGoal
                }
            })
        }

        set(cardRef, {
            ...updatedCard
        }).then(() => {
            Notifications.show({
                title: 'Success',
                message: 'Card details saved',
                color: 'green'
            })
            navigate(`/cards/${cardId}`);
        }).catch(() => {
            Notifications.show({
                title: 'There was an error',
                message: 'Encountered an error while trying to save card details. Please contact Nick',
                color: 'red'
            })
        })
    }

    return (
        <Container m="xs" w="100%" maw="100%" my="xl">
            <Box>
                <Breadcrumbs>
                    <Anchor component={NavLink} to="/cards-summary">Cards Summary</Anchor>
                    <Anchor component={NavLink} to={`/cards/${cardId}`}>{form.values.name || ''}</Anchor>
                    <Anchor>Edit</Anchor>
                </Breadcrumbs>
            </Box>

            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Box my="xl" ta="left">
                    <Title mt="xl" order={2} ta="left">Card details</Title>
                    <Box display="flex" mt="xs">
                        <TextInput w="100%" placeholder="Card Image URL" label="Card Image URL" {...form.getInputProps('cardImageUrl')} />
                        {form.values.cardImageUrl && (
                            <Image ml="lg" src={form.values.cardImageUrl} w="100" />
                        )}
                    </Box>
                    <Select mt="xs" placeholder="Company" label="Company" data={COMPANIES.map((company) => ({ label: company.name, value: company.id }))} {...form.getInputProps('companyId')} />
                    <TextInput mt="xs" placeholder="Name" label="Name" {...form.getInputProps('name')} />
                    <Textarea mt="xs" placeholder="Description" label="Description" {...form.getInputProps('description')} />
                    <Box mt="xs" display="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                        <NumberInput w="48%" label="Credit Limit" placeholder="Credit Limit" {...form.getInputProps('creditLimit')} />
                        <NumberInput w="48%" label="Annual Fee" placeholder="Annual Fee" {...form.getInputProps('annualFee')} />
                    </Box>
                    <Box mt="xs">
                        <Box display="flex" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <DatePickerInput clearable w="48%" placeholder="Open Date" label="Open Date" {...form.getInputProps('openDate')}  />
                            <DatePickerInput clearable w="48%" placeholder="Close Date" label="Close Date" {...form.getInputProps('closeDate')}  />
                        </Box>
                        <Box mt="xs" display="flex" style={{ alignItems: 'center', justifyContent: 'space-between', width: '48%' }}>
                            <NumberInput w="48%" label="Cycle Start Date" placeholder="Cycle Start Date" {...form.getInputProps('cycleStartDate')} />
                            <NumberInput w="48%" label="Cycle End Date" placeholder="Cycle End Date" {...form.getInputProps('cycleEndDate')} />
                        </Box>
                    </Box>
                </Box>

                <Box ta="left" my="xl">
                    <Title order={2}>Rewards</Title>
                    <Box mb="lg" w="100%" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SegmentedControl w="48%" mt="md" data={[ECardType.CASHBACK, ECardType.POINTS]} {...form.getInputProps('cardType')} />
                        {form.values.cardType === ECardType.POINTS && (
                            <TextInput w="48%" mt="md" placeholder="Rewards Points Name" {...form.getInputProps('rewardsPointsName')} />
                        )}
                    </Box>

                    <EditCardEarnRates form={form} />
                    <EditCardBenefits form={form}/>
                    <EditCardGoals form={form} />
                </Box>

                <Button mb="lg" fullWidth type="submit">Save</Button>
                <Button component={NavLink} to={`/cards/${cardId}`} fullWidth variant="subtle" c="red">Cancel</Button>
            </form>


        </Container>
    )
}

export default EditCard;