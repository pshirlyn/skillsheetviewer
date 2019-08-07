import React from "react";
import "react-table/react-table.css";
import "./GridView.css";
import ReactTable from "react-table";
import { Row, Col, Badge, Button, Input, Container } from "reactstrap";

import { Card, InputGroup, InputGroupAddon, CustomInput } from "reactstrap";
import useViewer from "../hooks/useViewer";
import { User } from "../Types";
import useData from "../hooks/useData";
import JSZip from "jszip";
import fileSaver from "file-saver";

const STARTINGYEAR = 2020;

const GridView: React.FC = () => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [shouldRefreshData, setShouldRefreshData] = React.useState(true);
  const [completeList, setCompleteList] = React.useState<User[]>([]);
  const [filterYear, setFilterYear] = React.useState("ALL");
  const [searchValue, setSearchValue] = React.useState("");
  const [user, setUser] = React.useState<User | null>(null);
  const { refreshData } = useData();
  const { isLoggedIn } = useViewer();

  React.useEffect(() => {
    if (shouldRefreshData && isLoggedIn) {
      setShouldRefreshData(false);
      (async () => {
        try {
          const newUsers = await refreshData();
          setCompleteList(newUsers);
        } catch (ex) {
          alert(ex);
        }
      })();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, shouldRefreshData]);

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

  if (!isLoggedIn) {
    window.location.href = "/landing";
    return null;
  }

  const columns = [
    {
      Header: "",
      Cell: (props: { original: null }) => (
        <>
          <Button
            onClick={e => toggleUser(props.original)}
            color={user === props.original ? "info" : "danger"}
          >
            View
          </Button>
        </>
      ),
      maxWidth: 80
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
            title="skillsheet"
            src={
              "https://docs.google.com/viewer?url=" +
              user.skillsheet +
              "&embedded=true"
            }
          />
        </object>
      </Col>
    ) : null;

  const filterView = isDownloading ? (
    <div> Creating your export... </div>
  ) : (
    <>
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
        <Button
          id="PopoverMoreOptions"
          type="button"
          onClick={() => {
            setIsDownloading(true);
            downloadZIP(filteredList, () => setIsDownloading(false));
          }}
        >
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
    </>
  );
  return (
    <Row className="GridView-row">
      <Col xs={user == null ? "12" : "6"} className="GridView-flex">
        <Container>
          {filterView}
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

function download(zip: JSZip, url: string) {
  const filename = url.split("/").slice(-1)[0];
  return new Promise<boolean>((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = () => {
      zip.file(filename, xhr.response);
      resolve(true);
    };
    xhr.onerror = reject;
    xhr.open("GET", url, true);
    xhr.send();
  });
}
const downloadZIP = async (list: User[], done: () => void) => {
  const zip = JSZip();
  const folder = zip.folder("hackmit-skillsheets-2019");
  // Try catch
  if (
    !window.confirm(
      "This may take a while (5 minutes) if you have not filtered anything. Do you want to continue?"
    )
  ) {
    done();
    return;
  }
  const allTasks: Promise<boolean>[] = [];
  list.forEach((user: User) => {
    allTasks.push(download(folder, user.skillsheet));
  });
  await Promise.all(allTasks);
  zip.generateAsync({ type: "blob" }).then(
    blob => {
      fileSaver.saveAs(blob, "hackmit-skillsheets-2019-filtered.zip");
    },
    function(err) {
      alert("whoops something went wrong :(");
    }
  );
  done();
};

export default GridView;
