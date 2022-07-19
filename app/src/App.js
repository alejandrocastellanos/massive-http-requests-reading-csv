import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {CSVLink} from 'react-csv';
import DownloadIcon from '@mui/icons-material/Download';

import {
    Alert,
    Box,
    Button,
    createTheme,
    Grid,
    Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    TextField,
    ThemeProvider, Typography
} from "@mui/material";
import AttachFileIcon from '@mui/icons-material/AttachFile';

function App() {

    const [data, setData] = useState([]);
    const [url, setUrl] = useState('');
    const [variables, setVariables] = useState([]);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState();
    const [success, setSuccess] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        setData([]);
        setUrl('');
    }, []);

    const changeHandler = (event) => {
        if (event.target.files[0].type !== 'text/csv'){
            setError('Formato de archivo no valido.')
        }else{
            setSending(false);
            setFileName(event.target.files[0].name);
            Papa.parse(event.target.files[0], {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    setData(results.data)
                    setVariables(Object.keys(results.data[0]))
                },
            });
        }
    };

    const darkTheme = createTheme({
        palette: {
            mode: 'light'
        },
        root: {
            display: "flex",
            flexFlow: "column",
            height: "100vh"
        }
    });

    const SendRequest = (e) => {
        setSending(true);
        e.preventDefault();
        let newData = [];
        data.forEach(function (values){
            fetch(url, {
                method: "POST",
                headers: new Headers({
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify(values)
            })
                .then(response => {
                    console.log('response', response)
                })
                .catch(error => {
                    console.log('error: ', error);
                    values['Result'] = 'error';
                    newData.push(values);
                    setData(newData);
                });
        });
        setSuccess(true);
    }

    function TableItems(props){
        if(props.emp.Result === 'sent'){
            return <TableCell align="center" sx={{ color: "green" }}>{props.emp[props.header]}</TableCell>;
        }else if(props.emp.Result === 'error'){
            return <TableCell align="center" sx={{ color: "red" }}>{props.emp[props.header]}</TableCell>
        }else{
            return <TableCell align="center">{props.emp[props.header]}</TableCell>
        }
    }

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <Box color={"text.primary"} sx={{
                    backgroundImage: "url('https://alejandrocastellanos.github.io/massive-http-requests-reading-csv/background.svg')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "150%",
                    position: "relative",
                    height: "100vh",
                    minHeight: "100%"
                }}>

                    <Grid fixed container spacing={2} columns={{ xs: 1, md: 6 }}>
                        <Grid  item
                              xs={3}
                              sx={{
                                  padding: "70px 0",
                                  textAlign: "center"
                              }}
                              p={20}
                              mt="7%"
                        >
                            <Box sx={{
                                padding: "50px 0",
                                textAlign: "center",
                                background: "white",
                                margin: "25px",
                                borderRadius: '16px',
                                boxShadow: 5,
                                opacity: 0.95
                            }}
                            >
                                <Typography variant="h4" style={{ marginTop: "-10px" }}>Send batch message</Typography>
                                <Box mt={2} mb={1}>
                                    <label htmlFor="upload-photo">
                                        <input
                                            style={{ display: 'none' }}
                                            id="upload-photo"
                                            name="upload-photo"
                                            type="file"
                                            onInput={changeHandler}
                                        />
                                        <Button startIcon={<AttachFileIcon />} color="secondary" variant="contained" component="span">
                                            Upload CSV
                                        </Button>
                                    </label>
                                </Box>
                                <Box sx={{ color: "green" }} mb={3}>
                                    {fileName}
                                </Box>
                                <Box  mb={5}>
                                    <TextField
                                        color="secondary"
                                        id="outlined-required"
                                        label="URL"
                                        sx={{ width: 350, height: 20 }}
                                        onChange={e => setUrl(e.target.value)}
                                    />
                                </Box>
                                <Box  mb={3}>
                                    <Button variant="contained" color="primary" onClick={SendRequest} disabled={sending}>Send</Button>
                                </Box>
                                <Box sx={{width: "70%", marginLeft: "15%"}}>
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <b>File name</b>
                                                    </TableCell>
                                                    <TableCell align="right">{fileName}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell component="th" scope="row">
                                                        <b>Url</b>
                                                    </TableCell>
                                                    <TableCell align="right">{url}</TableCell>
                                                </TableRow>
                                                { variables ?
                                                    variables.map((value) => {
                                                        return(
                                                            <TableRow>
                                                                <TableCell component="th" scope="row">
                                                                    <b>Variables</b>
                                                                </TableCell>
                                                                <TableCell align="right">{value}</TableCell>
                                                            </TableRow>
                                                        )
                                                    }) : <></>
                                                }
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                                <Snackbar
                                    open={true}
                                    autoHideDuration={2000}
                                    message="Mobile phone must start with 57"
                                />
                                {
                                    success && <Alert variant="filled" sx={{ marginTop: 5, marginLeft: 20, marginRight: 20 }} severity="success">Messages sent successfully</Alert>
                                }
                                {
                                    error && <Alert variant="filled" sx={{ marginTop: 5, marginLeft: 20, marginRight: 20 }} severity="error">Error sending messages. please contact the administrator</Alert>
                                }
                                {
                                    success &&
                                    <Box m={5}
                                                    display="flex"
                                                    justifyContent="flex-end"
                                                    alignItems="flex-end"
                                    >
                                        <Button
                                            startIcon={<DownloadIcon />}
                                            variant="contained"
                                            color="success"
                                        >
                                            <CSVLink
                                                data={data}
                                                filename="send_result.csv"
                                                style={{ color: "white", textDecoration: "none" }}
                                            >
                                                Download Results
                                            </CSVLink>
                                        </Button>
                                    </Box>
                                }
                            </Box>
                        </Grid>


                        <Grid item xs={3} mt={10} pr={5}>
                            <Box
                                sx={{
                                    textAlign: "center",
                                    background: "white",
                                    margin: "5px",
                                    borderRadius: '16px',
                                    boxShadow: 5,
                                    opacity: 0.95
                                }}
                            >
                                <TableContainer component={Paper} sx={{ maxHeight: 600, marginTop: 2, borderRadius: '16px' }}>
                                    <Typography
                                        variant="h4"
                                        style={{
                                            textAlign: "center",
                                            marginTop: 20,
                                            marginBottom: 10
                                        }}
                                    >
                                        Data table
                                    </Typography>
                                    <Table stickyHeader aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                {
                                                    variables.map((value) => {
                                                        return(
                                                            <TableCell align="center">{value}</TableCell>
                                                        )
                                                    })
                                                }
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.map((emp, index) => (
                                                <TableRow key={index}>
                                                    {variables.map(header => (

                                                        <TableItems header={header} emp={emp} />

                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}

export default App;
