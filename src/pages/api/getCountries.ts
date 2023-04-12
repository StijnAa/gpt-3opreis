import axios from "axios";
import jsonFromFile from "../../../public/embeddings.json";

const getCountries = async (req: any, res: any) => {
  const countries: string[] = [];
  jsonFromFile.forEach((element) => {
    // console.log(element.country);
    countries.push(element.country);
  });
  // Create a Set from the original array
  const uniqueSet = new Set(countries);

  // Convert the Set back to an array
  const uniqueArray = Array.from(uniqueSet);
  // console.log(uniqueArray);
  if (uniqueArray) {
    res.status(200).json(uniqueArray);
  } else {
    res.status(500).json("error");
  }
};
export default getCountries;
