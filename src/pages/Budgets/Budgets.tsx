import { Box, Container, List, LoadingOverlay, Title } from "@mantine/core";
import useGetBudgets from "../../hooks/useGetBudgets";
import classes from './Budgets.module.css';
import { setBudgetId } from "../../configs";
import { useNavigate } from "react-router-dom";
import { IconReportMoney } from "@tabler/icons-react";

function Budgets() {
    const navigate = useNavigate();
    const { data, isLoading } = useGetBudgets();

    const handleSelectBudget = (budgetId: string) => {
        setBudgetId(budgetId);
        navigate(`/cards-summary`)
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