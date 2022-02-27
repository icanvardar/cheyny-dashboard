import React, { useState, useRef, useEffect } from "react";
import useUploadImage from "../hooks/useUploadImage";
import useUploadIpfs from "../hooks/useUploadIpfs";
import { ToastContainer, toast } from "react-toastify";
import useWallet from "../hooks/useWallet";

const STEPS = ["Upload an image", "Enter product data", "Complete minting"];

const initialMetadata = {
  name: "",
  type: "",
  serialNumber: "",
  specifications: [],
  details: "",
  info: {
    amount: null,
    year: null,
    country: "",
  },
};

const ProductMintCard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [image, imageURL, onImageChange] = useUploadImage();
  const [metadata, setMetadata] = useState(initialMetadata);
  const [handleUploadIpfs] = useUploadIpfs();
  const [connectWallet, mintItem] = useWallet();
  const [tokenReceiver, setTokenReceiver] = useState();

  const handleUpload = async () => {
    const uri = await handleUploadIpfs({ ...metadata, image });
    console.log(uri);
    const res = await mintItem("ipfs://" + uri.path, tokenReceiver);
    console.log(res);
    // toast("Txn is sent!" + res.hash);
  };

  const Upload = () => {
    const _hiddenFileInput = useRef(null);

    const _handleClick = (event) => {
      _hiddenFileInput.current.click();
    };

    return (
      <div className="flex flex-col justify-center items-center">
        <input
          type="file"
          id="upload-button"
          onChange={onImageChange}
          ref={_hiddenFileInput}
          style={{ display: "none" }}
        />
        <div className="avatar">
          <img
            className="w-96 h-48 object-contain"
            src={imageURL && imageURL}
          />
        </div>
        <button onClick={_handleClick} className="btn btn-wide">
          Upload
        </button>
      </div>
    );
  };

  const ProductData = () => {
    const [specification, setSpecification] = useState("");

    const _handleSingleMetadataChange = (field, value) => {
      let tmp = metadata;
      tmp[field] = value;
      setMetadata(tmp);
    };

    const _handleArrMetadataChange = (fields, value) => {
      let tmp = metadata;
      tmp[fields[0]][fields[1]] = value;
      setMetadata(tmp);
    };

    const _addSpecification = () => {
      if (specification.length > 0) {
        let tmp = metadata;
        let { specifications } = tmp;
        const doesExist = specifications.find((s) => s.name === specification);
        if (!doesExist) {
          tmp.specifications.push({ name: specification });
          setSpecification("");
          setMetadata(tmp);
        }
      }
    };

    const _removeSpecification = (name) => {
      if (metadata.specifications.length > 0) {
        let tmp = metadata;
        let { specifications } = tmp;
        const filteredSpecifications = specifications.filter(
          (s) => s.name !== name
        );
        tmp.specifications = filteredSpecifications;
        setMetadata(tmp);
      }
    };

    useEffect(() => console.log(metadata), [metadata]);

    return (
      <div>
        <div className="flex flex-row">
          <div className="flex flex-col gap-4 w-full items-center">
            <input
              onChange={(e) =>
                _handleSingleMetadataChange("name", e.target.value)
              }
              // value={metadata.name}
              type="text"
              placeholder="Name"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              onChange={(e) =>
                _handleSingleMetadataChange("type", e.target.value)
              }
              // value={metadata.type}
              type="text"
              placeholder="Type"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              onChange={(e) =>
                _handleSingleMetadataChange("serialNumber", e.target.value)
              }
              // value={metadata.serialNumber}
              type="text"
              placeholder="Serial number"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <div className="flex flex-col gap-4 w-full items-center">
            <input
              onChange={(e) =>
                _handleArrMetadataChange(["info", "amount"], e.target.value)
              }
              // value={metadata.info.amount}
              type="text"
              placeholder="Amount"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              onChange={(e) =>
                _handleArrMetadataChange(["info", "year"], e.target.value)
              }
              // value={metadata.info.year}
              type="text"
              placeholder="Year"
              className="input input-bordered w-full max-w-xs"
            />
            <input
              onChange={(e) =>
                _handleArrMetadataChange(["info", "country"], e.target.value)
              }
              // value={metadata.info.country}
              type="text"
              placeholder="Country"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>
        <div flex flex-row>
          <div className="flex flex-col w-full items-center pr-10 pl-10 mt-4">
            <textarea
              onChange={(e) =>
                _handleSingleMetadataChange("details", e.target.value)
              }
              // value={metadata.details}
              className="textarea textarea-bordered w-full"
              placeholder="Details"
            ></textarea>
          </div>
        </div>
        <div className="flex flex-col w-full pr-10 pl-10 mt-4">
          <div className="form-control">
            <div className="input-group">
              <input
                onChange={(e) => setSpecification(e.target.value)}
                type="text"
                placeholder="Specification"
                className="input input-bordered w-full"
                // value={specification}
              />
              <button onClick={_addSpecification} className="btn btn-square">
                Add
              </button>
            </div>
          </div>
          {metadata.specifications.length > 0 && (
            <ul className="menu bg-base-100 w-56 p-2 mt-4 rounded-box">
              {metadata.specifications.map((s) => (
                <li>
                  <a onClick={() => _removeSpecification(s.name)}>{s.name}</a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  const CompleteMinting = () => {
    return (
      <div className="flex gap-4 justify-center">
        <div className="avatar">
          <img
            className="w-96 h-48 object-contain"
            src={imageURL && imageURL}
          />
        </div>
        <div>
          <h1 className="text-4xl">{metadata.name}</h1>
          <h1 className="text-2xl opacity-50">{metadata.type}</h1>
          <h1 className="text-xl mt-6">{metadata.details}</h1>
          <h1 className="text-sm opacity-50">
            Serial Number: #{metadata.serialNumber}
          </h1>
          <input
            onChange={(e) => setTokenReceiver(e.target.value)}
            type="text"
            placeholder="Token Receiver Address"
            className="input input-bordered mt-8 w-full max-w-xs"
          />
        </div>
      </div>
    );
  };

  const _handleStepComponents = () => {
    switch (currentStep) {
      case 0:
        return <Upload />;
      case 1:
        return <ProductData />;
      case 2:
        return <CompleteMinting />;
    }
  };

  const _handleSteps = (clickType) => {
    if (clickType === "next") {
      setCurrentStep(currentStep + 1);
    } else if (clickType === "back") {
      setCurrentStep(currentStep - 1);
    }
  };

  const _handleNextButton = () => {
    if (currentStep === 0 && image) {
      return;
    } else if (currentStep === 1) {
      return;
    }

    return "btn-disabled";
  };

  return (
    <>
      <ToastContainer />
      <div className="card w-full mt-4 bg-base-100 shadow-xl">
        <div className="card-body">
          <ul className="steps">
            {STEPS.map((step, i) => (
              <li
                key={i.toString()}
                className={`step ${i <= currentStep ? "step-primary" : ""}`}
              >
                {step}
              </li>
            ))}
          </ul>
          <div className="divider"></div>
          {/* <h2 className="card-title">{STEPS[currentStep]}</h2> */}
          {_handleStepComponents()}
          <div className="divider"></div>
          <div className="justify-end card-actions">
            {currentStep > 0 && (
              <button
                onClick={() => _handleSteps("back")}
                className="btn btn-primary"
              >
                Back
              </button>
            )}
            {currentStep < 2 && (
              <button
                onClick={() => _handleSteps("next")}
                className={`btn btn-secondary ${_handleNextButton()}`}
              >
                Next
              </button>
            )}
            {currentStep === 2 && (
              <button onClick={handleUpload} className="btn btn-accent">
                Mint
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductMintCard;
