import { useState } from "react";
import { IMedicinalLeaf } from "./interfaces/data";
import { medicinalLeaf } from "./mocks/data";
import { uploadService } from "./services/upload.service";

export default function App() {
  const [file, setFile] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [data, setData] = useState<IMedicinalLeaf | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const uploadedFile = e.target.files?.[0];

    if (!uploadedFile) {
      return;
    }

    setFile(URL.createObjectURL(uploadedFile));

    try {
      const response = await uploadService.uploadFileService(uploadedFile);
      setResult(response?.prediction);

      const matchingLeaf = medicinalLeaf.find((item) => item.eng_name === response?.prediction);
      setData(matchingLeaf || null);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }

  function handleRemoveFile(): void {
    setFile(null);
    setResult("");
    setData(null);
  }

  return (
    <div className="flex flex-col bg-gray-50/10 p-10 font-sans-serif items-center justify-center min-h-screen">
      <div className="relative h-auto bg-white rounded-lg shadow-lg w-4/5">
        <div className="relative border-b-2">
          <h1 className="text-3xl m-4 text-gray-600">Biobotanix</h1>
        </div>
        <div className="relative p-4" >
          <form className="relative" action="" >
            <div className="pt-0 flex flex-col">
              <label className="mb-4 text-gray-600 text-lg font-light" htmlFor="image">Image</label>
              {file ? (
                <div className="relative w-full h-full rounded-2xl border border-gray-300 overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center p-60"
                    style={{ backgroundImage: `url('${file ? file : 'https://plus.unsplash.com/premium_photo-1676637000058-96549206fe71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'}')` }}
                  ></div>
                </div>
              ) : (
                <label htmlFor="image" className="flex flex-col items-center justify-center border-4 border-gray-300 border-dashed rounded h-36 px-6 text-lg text-gray-600 focus:outline-none focus:ring focus:border-blue-300 cursor-pointer">
                  <svg className="w-8 h-8 text-gray-600
          " xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                  <span className="mt-2 text-base leading-normal text-blue-500 font-bold">Upload your image</span>
                  <input type="file" id="image" className="hidden" onChange={handleFileChange} />
                </label>
              )}
              <div className="flex">
                <p className="py-2 text-gray-400">Upload your image files in jpg or png.</p>
                {file && (
                  <button
                    type="button"
                    className="ml-auto text-red-600 text-lg font-light"
                    onClick={handleRemoveFile}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            {result ?
              (<div>
                <div className="mb-4 pt-0 flex flex-col">
                  <label className="mb-2 text-gray-800 text-lg font-light">Name</label>
                  <input type="text" className="border-2 rounded h-10 px-6 text-lg text-gray-600 focus:outline-none" value={result} disabled />
                  <label className="my-2 text-gray-800 text-lg font-light">Properties</label>
                  <textarea rows={7} id="message" className="block p-2.5 px-6 w-full bg-gray-50 rounded-lg border border-gray-300 text-lg text-gray-600" value={data?.properties ? data.properties : 'No Properties Found.'} disabled></textarea>
                  <label className="my-2 text-gray-800 text-lg font-light">Scientific Name</label>
                  <input type="text" className="border-2 rounded h-10 px-6 text-lg text-gray-600 focus:outline-none" value={data?.scientific_name ? data.scientific_name : 'No Sciencetific Name'} disabled />
                  <label className="my-2 text-gray-800 text-lg font-light">Thai Name</label>
                  <input type="text" className="border-2 rounded h-10 px-6 text-lg text-gray-600 focus:outline-none" value={data?.thai_name ? data.thai_name : 'No Thai Name'} disabled />
                </div>
              </div>) : (
                <div className="mb-4 pt-0 flex flex-col">
                  <label className="mb-2 text-gray-800 text-lg font-light">Name</label>
                  <input type="text" className="border-2 rounded h-10 px-6 text-lg text-gray-600 focus:outline-none" value="No prediction" disabled />
                </div>
              )}
          </form>
        </div>
      </div>
    </div >
  )
}