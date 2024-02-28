import { Container, List, LoadingOverlay, Text, Title } from "@mantine/core";
import { IconReportMoney } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { setBudgetId } from "../../configs";
import useGetBudgets from "../../hooks/useGetBudgets";
import classes from './Budgets.module.css';

function Budgets() {
    const navigate = useNavigate();
    const { data, isLoading, isError } = useGetBudgets();

    const handleSelectBudget = (budgetId: string) => {
        setBudgetId(budgetId);
        navigate(`/cards-summary`)
    }

    if (isError) {
        return (
            <Container m="xs" w="100%" maw="100%">
                <Title ta="left" mb="xl">Select a budget</Title>
                <Text ta="left" c="red">There was an error</Text>
            </Container>
        )
    }

    return (
        <Container m="xs" w="100%" maw="100%">
            <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <Title ta="left" mb="xl">Select a budget</Title>
            <List spacing="xs" size="xl" center icon={<IconReportMoney />} ta="left">
                {(data || []).map((budget) => (
                    <List.Item py="xl" onClick={() => handleSelectBudget(budget.id)} key={budget.id} className={classes['budget-option']}>
                        <Title order={2}>
                            {budget.name}
                        </Title>
                    </List.Item>
                ))}
            </List>
        </Container>
    )
}

export default Budgets;