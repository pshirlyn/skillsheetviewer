import React from "react";

import "react-table/react-table.css";
import "./GridView.css";
import ReactTable from "react-table";
import {
  Row,
  Col,
  Badge,
  Button,
  FormGroup,
  Input,
  Container
} from "reactstrap";

import {
  Card,
  InputGroup,
  InputGroupAddon,
  CustomInput,
  InputGroupText
} from "reactstrap";

const STARTINGYEAR = 2020;

type User = {
  id: string;
  name: string;
  skillsheet: string;
  school: string;
  tracks: string;
  email: string;
  major: string;
  year: string;
};

const GridView: React.FC = () => {
  const [completeList, setCompleteList] = React.useState<User[]>([
    {
      id: "1oifjasba",
      name: "TEST",
      email: "test@test.tt",
      school: "Test Institute",
      tracks: "hi,tes",
      major: "cs",
      year: "2021",
      skillsheet:
        "https://s3.us-east-1.amazonaws.com/hackmit-skill-sheets-2019/60e7556d-6377-4563-aa1a-e1c30a32c7cd"
    }
  ]);
  const [filterYear, setFilterYear] = React.useState("ALL");
  const [searchValue, setSearchValue] = React.useState("");
  const [user, setUser] = React.useState<User | null>(null);

  const filteredList = React.useMemo(() => {
    let finalList: User[] = completeList;
    if (filterYear !== "ALL") {
      finalList = finalList.filter((user: User) => {
        return user.year === filterYear;
      });
    }
    if (searchValue.length > 0) {
      const value = searchValue.toLowerCase();
      finalList = finalList.filter((user: User) => {
        return (
          user.name.toLowerCase().includes(value) ||
          user.school.toLowerCase().includes(value) ||
          user.email.toLowerCase().includes(value) ||
          user.tracks.toLowerCase().includes(value)
        );
      });
    }
    return finalList;
  }, [completeList, filterYear, searchValue]);

  const toggleUser = React.useCallback(
    newUser => {
      if (newUser === user) {
        setUser(null);
      } else {
        setUser(newUser);
      }
    },
    [user]
  );

  const columns = [
    {
      Header: "",
      Cell: (props: { original: null }) => (
        <>
          <Button color={user && user.id ? "info" : "danger"}>Star</Button>
          <Button
            onClick={e => toggleUser(props.original)}
            color={user === props.original ? "info" : "danger"}
          >
            View
          </Button>
        </>
      )
    },
    { Header: "Name", accessor: "name" },
    { Header: "School", accessor: "school" },
    { Header: "Year", accessor: "year" },
    {
      Header: "Tracks",
      accessor: "tracks",
      Cell: (row: { value: string }) => {
        return row.value.split(",").map((trackName: string) => {
          return (
            <span key={trackName}>
              <Badge color="primary">{trackName}</Badge>{" "}
            </span>
          );
        });
      }
    }
  ];
  const pdfView =
    user != null ? (
      <Col xs="6" className="GridView-PDFContainer">
        <Card>
          <h2 className="text-center">{user.name}</h2>
          <p>Major: {user.major}</p>
        </Card>
        <object
          data={user.skillsheet}
          className="GridView-PDF"
          type="application/pdf"
        >
          <iframe
            src={
              "https://docs.google.com/viewer?url=" +
              user.skillsheet +
              "&embedded=true"
            }
          />
        </object>
      </Col>
    ) : null;
  return (
    <Row className="GridView-row">
      <Col xs={user == null ? "12" : "6"} className="GridView-flex">
        <Container>
          <InputGroup>
            <InputGroupAddon addonType="prepend">Filter By:</InputGroupAddon>
            <InputGroupAddon addonType="prepend">
              <CustomInput
                id="filter_year_input"
                type="select"
                name="filterYear"
                value={filterYear}
                onChange={event => setFilterYear(event.target.value)}
              >
                <option key="ALL" value="ALL">
                  All years
                </option>
                {[
                  STARTINGYEAR,
                  STARTINGYEAR + 1,
                  STARTINGYEAR + 2,
                  STARTINGYEAR + 3
                ].map(val => {
                  return (
                    <option key={val} value={val}>
                      {val}
                    </option>
                  );
                })}
              </CustomInput>
            </InputGroupAddon>

            <Button id="PopoverMoreOptions" type="button">
              Export as CSV
            </Button>
            <Button id="PopoverMoreOptions" type="button">
              Export as ZIP
            </Button>
          </InputGroup>
          <Input
            name="searchValue"
            value={searchValue}
            onChange={event => setSearchValue(event.target.value)}
            onKeyPress={() => console.log("press")}
            placeholder="Name, email, year..."
          />
          <ReactTable
            data={filteredList}
            columns={columns}
            defaultPageSize={10}
          />
        </Container>
      </Col>
      {pdfView}
    </Row>
  );
};

export default GridView;
