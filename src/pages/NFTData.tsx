// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// interface NFT {
//   id: string;
//   name: string;
//   description: string;
//   image: string;
//   hash: string;
// }

// interface NFTGalleryProps {
//   contractAddress: string;
//   abi: ethers.ContractInterface;
// }

// const NFTGallery: React.FC<NFTGalleryProps> = () => {
//   const [nfts, setNfts] = useState<NFT[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const fetchNFTs = async () => {
//     const id = toast.loading("Fetching NFTs...");
//     try {
//       setLoading(true);
//       let toAddress = null;
//       //let networkName = null;
//       const accounts= await getAccount(oktoClient);
//       console.log("accounts",accounts)
//       if(accounts?.length>0)
//       {
//         console.log("accounts",accounts)
//         const acc= accounts.find((accs:any)=>accs.networkName==="POLYGON");
//         toAddress=acc?.address
//       }
//       if (toAddress) {
//         const authToken = await oktoAuthTokenGenerator();
//         //console.log("Auth Token: ", authToken);

//         const response = await fetch(
//           "https://apigw.okto.tech/api/oc/v1/readContractData",
//           {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${authToken}`,
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//               caip2id: "eip155:137",
//               data: {
//                 contractAddress:`${import.meta.env.VITE_ContractAddress}`,
//                 abi: {
//                   inputs: [
//                     {
//                       internalType: "address",
//                       name: "user",
//                       type: "address",
//                     },
//                   ],
//                   name: "getTokenIds",
//                   outputs: [
//                     {
//                       internalType: "uint256[]",
//                       name: "",
//                       type: "uint256[]",
//                     },
//                   ],
//                   stateMutability: "view",
//                   type: "function",
//                 },
//                 args: {
//                   user:`${toAddress}`,
//                 },
//               },
//             }),
//           }
//         );

//         const data = await response.json();
//         const tokenIds = data.data;
//         //console.log("NFT Data:", data);
//         if (tokenIds.length > 0) {
//           // Flatten the array if `tokenIds` is an array of arrays
//           const flattenedTokenIds = tokenIds.flat(); // Flattens nested arrays into a single array

//           // Fetch metadata for each token ID
//           const nftPromises = flattenedTokenIds.map(async (tokenId: string) => {
//             try {

//               // Get the token URI
//               const tokenUriRes = await fetch(
//                 "https://apigw.okto.tech/api/oc/v1/readContractData",
//                 {
//                   method: "POST",
//                   headers: {
//                     Authorization: `Bearer ${authToken}`,
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify({
//                     caip2id: "eip155:137",
//                     data: {
//                       contractAddress:
//                         `${import.meta.env.VITE_ContractAddress}`,
//                       abi: {
//                         inputs: [
//                           {
//                             internalType: "uint256",
//                             name: "tokenId",
//                             type: "uint256",
//                           },
//                         ],
//                         name: "tokenURI",
//                         outputs: [
//                           {
//                             internalType: "string",
//                             name: "",
//                             type: "string",
//                           },
//                         ],
//                         stateMutability: "view",
//                         type: "function",
//                       },
//                       args: { tokenId: Number(tokenId) },
//                     },
//                   }),
//                 }
//               );

//               const tokenUriData = await tokenUriRes.json();
//               console.log("token uri",tokenUriData);
//               if (tokenUriData?.data?.length === 0)
//                 throw new Error(`Token URI not found for token ID: ${tokenId}`);
              
//               //Fetch metadata from the URI
//               const metadataUrl = `${import.meta.env.VITE_AzureGATWAY}/${tokenUriData?.data[0]}`;
//               console.log("metadataUrl",metadataUrl)
//               const response = await fetch(metadataUrl);
//               console.log("metadataUrl",response);
//               const metadata = await response.json();
//               console.log("metadata res",response);
//               if (!metadata)
//                 throw new Error(
//                   `Failed to fetch metadata from: ${metadataUrl}`
//                 );
//               if(metadata)
//               return {
//                 id: tokenId,
//                 name: metadata.name || "Unknown Name",
//                 description: metadata.description || "No Description",
//                 image: metadata.image || "",
//                 hash: metadata.hash || "",
//               };
//             } catch (err) {
//               console.error(
//                 `Error fetching metadata for token ID ${tokenId}:`,
//                 err
//               );
//               return null; // Return null if an error occurs for a specific token
//             }
//           });

//           // Wait for all NFT metadata to be fetched
//           const fetchedNFTs = await Promise.all(nftPromises);
//           setNfts(fetchedNFTs.filter((nft) => nft !== null)); // Filter out null values
//         } else {
//           console.warn("No token IDs found");
//           toast.error("No NFTs found for this address.");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching NFTs:", error);
//       toast.error("Failed to fetch NFTs.");
//     } finally {
//       toast.dismiss(id);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNFTs();
//   }, []);

//   return (
//     <div className="p-4 w-full">
//       <h1 className="text-[#006666] text-3xl font-bold text-center mb-6">
//         NFT Gallery
//       </h1>
//       {loading ? (
//         <p className="text-center text-lg">Loading NFTs...</p>
//       ) : nfts.length === 0 ? (
//         <p className="text-red-500 text-center text-lg">No NFTs found.</p>
//       ) : (
//         <div className="flex flex-wrap justify-center items-center gap-4">
//           {nfts.map((nft) => (
//             <div
//               key={nft.id}
//               className="rounded-lg p-[1px] bg-gradient-to-r from-[#03257e] via-[#006666] to-[#f14419] shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
//             >
//               <div className="flex flex-col justify-center bg-white items-center border border-gray-300 rounded-lg overflow-hidden ">
//                 <div className="flex justify-center items-cente w-full">
//                   <img
//                     src={nft.image}
//                     alt={nft.name}
//                     className="max-w-max h-24 object-contain"
//                   />
//                 </div>
//                 <div className="p-2 w-[280px] text-center">
//                   <h2 className="font-semibold font-sans text-[#03257e]">
//                     {nft.name}
//                   </h2>
//                   <p className="text-sm text-[#006666] font-sans ">{nft.description}</p>
//                   <p className="text-sm text-gray-800 font-semibold mt-2">
//                     Token ID: {nft.id}
//                   </p>
//                   {nft?.hash && (
//                     <a
//                       className="inline-block mt-4 text-sm text-white bg-[#ff7300] px-4 py-2 rounded-full hover:bg-[#006666] transition-all"
//                       href={`${import.meta.env.VITE_AzureGATWAY}/${nft.hash}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       View Certificate
//                     </a>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default NFTGallery;
