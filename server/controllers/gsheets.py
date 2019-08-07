import gspread
from server.app import app
from oauth2client.service_account import ServiceAccountCredentials

scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']

credentials = ServiceAccountCredentials.from_json_keyfile_name(
    'service_account.json', scope)

gc = gspread.authorize(credentials)
adminsheetkey = app.config["GSHEETS_ADMIN_SHEET"]

try:
    mastersheet = gc.open_by_key(adminsheetkey)
except:
    print("could not open GSHEETS_ADMIN_SHEET")


def queryUsers():
    print("Updating Users from Google Sheets")
    try:
        wks = mastersheet.worksheet("Users")
        list_of_lists = wks.get_all_values()
        ret = {}
        # 1 Active?
        # 2 Email
        # 3 Company Name
        for line in list_of_lists:
            if len(line) < 4 or "#" in line[0]:
                continue
            if line[1] != "TRUE":
                continue
            ret[line[2]] = {
                "email": line[2],
                "name": line[3]
            }
        return ret
    except:
        print("could not open Users tab")
    return []


def queryData():
    """ Returns UserPublic[], {userid => UserPrivate}"""
    print("Updating Data from Google Sheets")
    # 1    _id
    # 2    email
    # 3    profile.name
    # 4    profile.school
    # 5    profile.graduationYear
    # 6    profile.major
    # 7    skillsheetURL
    # 8    confirmation.track1
    # 9    confirmation.track2
    # 10   confirmation.track3
    # 11   confirmation.wantsSponsorOpportunities
    try:
        wks = mastersheet.worksheet("Data")
        list_of_lists = wks.get_all_values()
        ret = []
        privateref = {}
        for line in list_of_lists:
            if len(line) < 12 or "#" in line[0]:
                continue
            # Will not offer for students not interested in sponsorship opportunities
            if line[11] != "TRUE":
                continue
            urlsafename = line[3].replace(" ", "_")
            ret.append({
                "id": line[1],
                "name": line[3],
                "email": line[2],
                "school": line[4],
                "tracks": ",".join(list(filter(lambda x: len(x) > 0, [line[8], line[9], line[10]]))),
                "major": line[6],
                "year": line[5],
                "skillsheet": f"/api/v1/skillsheet/{line[1]}/{urlsafename}_{line[5]}.pdf"
            })
            privateref[line[1]] = {
                "skillsheet": app.config["GSHEETS_SKILLSHEET_URL_PREAPPEND"] + line[7]
            }
        return ret, privateref
    except Exception as e:
        print(e)
        print("could not open Data tab")
    return [], {}
