/* Author: Parth Thummar */
import React, { useState, useEffect } from "react";
import {
  getCollectionRequestByPincode,
  pickDeposit,
} from "../../../apis/collectorAPIs.js";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Button,
  TextField,
} from "@material-ui/core";
import useStyles from "./styles.js";

function ViewCollection({}) {
  const classes = useStyles();

  const [collectionRequest, setCollectionRequest] = useState([]);

  useEffect(() => {
    getAllCollectionRequest();
  }, []);

  async function getAllCollectionRequest() {
    await getCollectionRequestByPincode()
      .then((res) => {
        const responseExists = res.data !== null || res.data !== undefined;
        if (responseExists) {
          res.data.payload.forEach((collectionRequest) => {
            collectionRequest.display = true;
          });
        }
        setCollectionRequest(res.data.payload);
      })
      .catch((err) => {
        setCollectionRequest([]);
      });
  }

  function handlePick(id, userId) {
    const loggedInUserId = JSON.parse(localStorage.getItem("user")).email;
    pickDeposit(id, loggedInUserId).then((res) => {
      collectionRequest.map((data) => {
        if (data.id == id) {
          data.status = 1;
        }
      });
      setCollectionRequest([...collectionRequest]);
    });
  }

  function onSearchClick(event) {
    collectionRequest.forEach((data) => {
      if (data.pincode.includes(event.target.value)) {
        data.display = true;
      } else {
        data.display = false;
      }
    });
    setCollectionRequest([...collectionRequest]);
  }

  return (
    <div style={{ paddingTop: 50 }}>
      <Typography variant="h6" style={{ color: "#154001", fontWeight: 600 }}>
        Collection requests
      </Typography>
      <Grid item xs={12} sm={6}>
        <TextField
          style={{
            marginTop: "30px",
            width: "100%",
          }}
          fullWidth
          margin="normal"
          id="search"
          type="text"
          name="search"
          label="Search By Pincode"
          variant="outlined"
          autoComplete="off"
          onChange={(e) => onSearchClick(e)}
        />
      </Grid>
      <Grid
        className={classes.container}
        container
        alignItems="stretch"
        spacing={3}
        style={{ marginTop: 5, marginBottom: 10 }}
      >
        {collectionRequest.map((data) => {
          if (data.display == true) {
            let garbagetype = "";
            if (data.drywaste === 1) {
              garbagetype += " " + "drywaste";
            }
            if (data.wetwaste === 1) {
              garbagetype += " " + "wetwaste";
            }
            if (data.medicalwaste === 1) {
              garbagetype += " " + "medicalwaste";
            }
            if (data.others === 1) {
              garbagetype += " " + "others";
            }
            let status = "";
            if (data.status === 0) {
              status = "Open";
            } else {
              status = "Accepted to Pick";
            }
            if (status === "Open") {
              return (
                <Grid key={data._id} item xs={11} sm={6} md={5}>
                  <Card className={classes.card} elevation={6}>
                    <CardContent>
                      <Typography
                        align="left"
                        gutterBottom
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                      >{`TaskName : ${data.taskname}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        noWrap
                        gutterBottom
                      >{`Garbage weight : ${data.weight}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        gutterBottom
                      >{`Address : ${data.address}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        gutterBottom
                      >{`Pincode : ${data.pincode}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        gutterBottom
                      >{`Scheduled : ${data.schedule}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        gutterBottom
                      >{`Garbage Type : ${garbagetype}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        gutterBottom
                      >{`Contact Number : ${data.phonenumber}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        gutterBottom
                      >{`Instruction : ${data.instructions}`}</Typography>
                      <Typography
                        variant="body2"
                        color={"textSecondary"}
                        component="p"
                        gutterBottom
                      >{`Status : ${status}`}</Typography>
                    </CardContent>
                    <div className={classes.button}>
                      <IconButton
                        variant="contained"
                        onClick={() => handlePick(data.id, data.userId)}
                      >
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "#60A62E", color: "white" }}
                        >
                          Pick
                        </Button>
                      </IconButton>
                    </div>
                  </Card>
                </Grid>
              );
            }
          }
        })}
      </Grid>
    </div>
  );
}

export default ViewCollection;
