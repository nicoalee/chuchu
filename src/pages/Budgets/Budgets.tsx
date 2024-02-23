import { Box, Container, LoadingOverlay, Title } from "@mantine/core";
import useGetBudgets from "../../hooks/useGetBudgets";
import classes from './Budgets.module.css';
import { setBudgetId } from "../../configs";
import { useNavigate } from "react-router-dom";

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
            <Title mb="md" ta="left">Select a budget</Title>
            <Box ta="left">
                {
                    (data || []).map((budget) => (
                        <Box onClick={() => handleSelectBudget(budget.id)} key={budget.id} p="lg" my="lg" className={classes['budget-option']}>
                            <Title order={1}>{budget.name}</Title>
                        </Box>
                    ))
                }
            </Box>
        </Container>
    )
}

export default Budgets;