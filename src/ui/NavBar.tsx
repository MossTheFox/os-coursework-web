import { AppBar, Toolbar, Typography, Container } from "@mui/material";

function NavBar() {

    return (
        <AppBar position="sticky">
            <Container maxWidth="lg">
                <Toolbar>
                    <Typography variant="h6" fontWeight={"bolder"}>
                        OS-Coursework
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;