import React, { useState } from "react";
import "./mypapers.css";
import PaperCard from "../explore/PaperCard";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Web3 from "web3";
import { PaperCardLoading } from "../paperCardLoading/index";
import ConnectWallet from "../connectWallet/ConnectWallet";
import NoPapers from "../NoPapers/NoPapers";

export const Mypapers = ({ path }) => {
  const paperData = useSelector((state) => state.paper.myPapers).data;
  const { address } = useSelector((state) => state.paper.wallet);
  const myPapersLoading = useSelector((state) => state.paper.myPapers.loading);

  console.log(myPapersLoading)

  return (
    <>
      <ToastContainer
        className="toast-margin"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="mypapers">
        {!myPapersLoading ? (
          paperData.length !== 0 ? (
            <div className="mypapers_papers">
              <PaperCardRenderer data={paperData} path={path} />
            </div>
          ) : !address ? (
            <div className="mypapers_papers" style={{ display: "block" }}>
              <ConnectWallet />
            </div>
          ) : (
            <NoPapers />
          )
        ) : (
          <div className="mypapers_papers">
            {[1, 2, 3, 4, 5].map((item) => (
              <PaperCardLoading />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const PaperCardRenderer = ({ data, path }) => {
  const { connected, address, correctNetwork } = useSelector(
    (state) => state.paper.wallet
  );
  const contract = useSelector((state) => state.paper.contract);
  const [updating, setUpdating] = useState(false);

  const toastStyles = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  function UpdatePaper(paperid, updateAmount, fundToggle) {
    let fund = fundToggle ? updateAmount : "0";
    if (connected && correctNetwork) {
      setUpdating(true);
      contract.methods
        .updatepaper(paperid, fundToggle, Web3.utils.toWei(fund, "ether"))
        .send({ from: address })
        .then(() => {
          toast("🦄️ Research Paper Updated!", toastStyles);
          setUpdating(false);
        })
        .catch((error) => {
          toast("Error while updating paper, try again...", toastStyles);
          setUpdating(false);
          console.log(error);
        });
    }
  }

  return data.map((paper) => {
    return (
      <PaperCard
        data={paper}
        page={path === "/profile" ? "" : "mypapers"}
        currentAmount={`${paper.fundAmount} MATIC`}
        callupdate={(updateAmount, fundToggle) =>
          UpdatePaper(paper.paperid, updateAmount, fundToggle)
        }
        updating={updating}
        allowFunding={paper.allowFunding}
      />
    );
  });
};
