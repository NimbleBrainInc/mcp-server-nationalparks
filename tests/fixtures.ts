/**
 * Mock NPS API responses for unit tests.
 * These match the NPSResponse<T> shape from npsApiClient.ts.
 */

import type {
  NPSResponse,
  ParkData,
  AlertData,
  VisitorCenterData,
  CampgroundData,
  EventData,
} from "../src/utils/npsApiClient.js";

const baseAddress = {
  postalCode: "95389",
  city: "Yosemite Valley",
  stateCode: "CA",
  line1: "PO Box 577",
  line2: "",
  line3: "",
  type: "Physical",
};

const baseContact = {
  phoneNumbers: [
    { phoneNumber: "209-372-0200", description: "Main", extension: "", type: "Voice" },
  ],
  emailAddresses: [
    { description: "General", emailAddress: "yose_info@nps.gov" },
  ],
};

const baseHours = {
  exceptions: [],
  description: "Open all year",
  standardHours: {
    sunday: "All Day",
    monday: "All Day",
    tuesday: "All Day",
    wednesday: "All Day",
    thursday: "All Day",
    friday: "All Day",
    saturday: "All Day",
  },
  name: "Main Hours",
};

export const mockPark: ParkData = {
  id: "1",
  url: "https://www.nps.gov/yose/index.htm",
  fullName: "Yosemite National Park",
  parkCode: "yose",
  description: "A park with granite cliffs and waterfalls.",
  latitude: "37.8651",
  longitude: "-119.5383",
  latLong: "lat:37.8651, long:-119.5383",
  activities: [{ id: "1", name: "Hiking" }],
  topics: [{ id: "1", name: "Mountains" }],
  states: "CA",
  contacts: baseContact,
  entranceFees: [{ cost: "35.00", description: "Vehicle fee", title: "Vehicle" }],
  entrancePasses: [{ cost: "70.00", description: "Annual pass", title: "Annual" }],
  fees: [],
  directionsInfo: "Highway 120 or Highway 140",
  directionsUrl: "https://www.nps.gov/yose/planyourvisit/directions.htm",
  operatingHours: [baseHours],
  addresses: [baseAddress],
  images: [
    {
      credit: "NPS",
      title: "Half Dome",
      altText: "Half Dome",
      caption: "Iconic granite formation",
      url: "https://example.com/halfdome.jpg",
    },
  ],
  weatherInfo: "Expect variable weather.",
  name: "Yosemite",
  designation: "National Park",
};

export const mockAlert: AlertData = {
  id: "1",
  url: "https://www.nps.gov/yose/alerts.htm",
  title: "Road Closure",
  parkCode: "yose",
  description: "Tioga Road is closed for the season.",
  category: "Park Closure",
  lastIndexedDate: "2025-01-15T00:00:00Z",
};

export const mockVisitorCenter: VisitorCenterData = {
  id: "1",
  url: "https://www.nps.gov/yose/planyourvisit/yosemitevalleyvisitorcenter.htm",
  name: "Yosemite Valley Visitor Center",
  parkCode: "yose",
  description: "Main visitor center in Yosemite Valley.",
  latitude: "37.7490",
  longitude: "-119.5885",
  latLong: "lat:37.7490, long:-119.5885",
  directionsInfo: "Located in Yosemite Village",
  directionsUrl: "https://www.nps.gov/yose/directions.htm",
  addresses: [baseAddress],
  operatingHours: [baseHours],
  contacts: baseContact,
};

export const mockCampground: CampgroundData = {
  id: "1",
  url: "https://www.nps.gov/yose/planyourvisit/upperpines.htm",
  name: "Upper Pines Campground",
  parkCode: "yose",
  description: "Popular campground in Yosemite Valley.",
  latitude: "37.7370",
  longitude: "-119.5652",
  latLong: "lat:37.7370, long:-119.5652",
  audioDescription: "",
  isPassportStampLocation: false,
  passportStampLocationDescription: "",
  passportStampImages: [],
  geometryPoiId: "",
  reservationInfo: "Reservations required April through October.",
  reservationUrl: "https://www.recreation.gov",
  regulationsurl: "",
  regulationsOverview: "Follow bear safety guidelines.",
  amenities: {
    trashRecyclingCollection: true,
    toilets: ["Flush Toilets"],
    internetConnectivity: false,
    showers: [],
    cellPhoneReception: false,
    laundry: false,
    amphitheater: true,
    dumpStation: true,
    campStore: false,
    staffOrVolunteerHostOnsite: true,
    potableWater: ["Spigots"],
    iceAvailableForSale: false,
    firewoodForSale: true,
    foodStorageLockers: true,
  },
  contacts: baseContact,
  fees: [{ cost: "26.00", description: "Per night", title: "Camping Fee" }],
  directionsOverview: "In Yosemite Valley",
  directionsUrl: "https://www.nps.gov",
  operatingHours: [baseHours],
  addresses: [baseAddress],
  weatherOverview: "Cold winters, mild summers.",
  numberOfSitesReservable: "238",
  numberOfSitesFirstComeFirstServe: "0",
  campsites: {
    totalSites: "238",
    group: "0",
    horse: "0",
    tentOnly: "68",
    electricalHookups: "0",
    rvOnly: "0",
    walkBoatTo: "0",
    other: "0",
  },
  accessibility: {
    wheelchairAccess: "Some sites accessible",
    internetInfo: "",
    cellPhoneInfo: "",
    fireStovePolicy: "Fires allowed in fire rings",
    rvAllowed: true,
    rvInfo: "",
    rvMaxLength: "35",
    additionalInfo: "",
    trailerMaxLength: "24",
    adaInfo: "",
    trailerAllowed: true,
    accessRoads: ["Paved"],
    classifications: [],
  },
};

export const mockEvent: EventData = {
  id: "1",
  url: "https://www.nps.gov/yose/events.htm",
  title: "Ranger-Led Hike",
  parkFullName: "Yosemite National Park",
  description: "Join a ranger for a guided hike.",
  latitude: "37.8651",
  longitude: "-119.5383",
  category: "Ranger Program",
  subcategory: "Hike",
  location: "Yosemite Valley",
  tags: ["hiking", "ranger"],
  recurrenceDateStart: "",
  recurrenceDateEnd: "",
  times: [{ timeStart: "09:00", timeEnd: "12:00", sunriseTimeStart: false, sunsetTimeEnd: false }],
  dates: ["2025-06-15"],
  dateStart: "2025-06-15",
  dateEnd: "2025-06-15",
  regresurl: "",
  contactEmailAddress: "yose_info@nps.gov",
  contactTelephoneNumber: "209-372-0200",
  feeInfo: "Free",
  isRecurring: false,
  isAllDay: false,
  siteCode: "yose",
  parkCode: "yose",
  organizationName: "NPS",
  types: ["Ranger Program"],
  createDate: "2025-01-01",
  lastUpdated: "2025-01-10",
  infoURL: "",
  portalName: "",
};

/** Wrap data in the standard NPS API response envelope. */
export function npsResponse<T>(data: T[], total?: number): NPSResponse<T> {
  return {
    total: String(total ?? data.length),
    limit: "10",
    start: "0",
    data,
  };
}
