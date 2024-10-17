import React, { useState } from "react";
import './../css/Card.css';
import { Link } from "react-router-dom";



const Card = () => {
    const MudaCard = () => {
 
        const card = document.querySelector(".card");
        const cardDescription = document.querySelector(".card-description");
        const cardDetails = document.querySelector(".card-details");
 
        card.style.height = "28em";
       
        cardDescription.style.display = "block";
       
        cardDetails.style.display = "flex";
        cardDetails.style.alignItems ="center";
        cardDetails.style.justifyContent ="center";
       
    }

    return (
        <div className="card">
            <div className="card-capa">
                <p><span className="card-title">Pegar lixo na praia</span><span></span></p>
            </div>
            <div className="card-text">
           <p className="card-description">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Voluptatibus ab et magni molestiae enim iu sto minima. Magni quos suscipit iste, ut dignissimos sapiente laboriosam modi recusandae. Molestias autem ratione quasi.</p>
                <div className="card-text-first">
                    <strong>Por limpa+</strong>
                    <strong className="date-container">
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1688 8 10.375 8H11.625C11.8312 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8312 10 11.625 10H10.375C10.1688 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1688 10.1688 12 10.375 12H11.625C11.8312 12 12 12.1688 12 12.375V13.625C12 13.8312 11.8312 14 11.625 14H10.375C10.1688 14 10 13.8312 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1688 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1688 8 12.375V13.625C8 13.8312 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8312 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1688 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1688 4 12.375V13.625C4 13.8312 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8312 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z" fill="#1F0171"/>
                        </svg>
                        <span>
                            29/09/2028
                        </span>
                    </strong>
                </div>
                <div className="card-text-second">
                    <span>São Paulo, Rua dos Banzeiros</span>
                    <span className="members-container">
                        <svg fill="#1f0171" viewBox="0 0 35 35" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" stroke="#1f0171">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path class="clr-i-solid clr-i-solid-path-1" d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.59,6.59,0,0,1,12,16.14Z"></path>
                                <path class="clr-i-solid clr-i-solid-path-2" d="M31.34,18.63a8.67,8.67,0,0,0-6.43-2.52,10.47,10.47,0,0,0-1.09.06,6.59,6.59,0,0,1-2,2.45,10.91,10.91,0,0,1,5,3l.25.28.54.62v4.71h3.94V18.91Z"></path>
                                <path class="clr-i-solid clr-i-solid-path-3" d="M11.1,14.19c.11,0,.2,0,.31,0a6.45,6.45,0,0,1,3.11-6.29,4.09,4.09,0,1,0-3.42,6.33Z"></path>
                                <path class="clr-i-solid clr-i-solid-path-4" d="M24.43,13.44a6.54,6.54,0,0,1,0,.69,4.09,4.09,0,0,0,.58.05h.19A4.09,4.09,0,1,0,21.47,8,6.53,6.53,0,0,1,24.43,13.44Z"></path>
                                <circle class="clr-i-solid clr-i-solid-path-5" cx="17.87" cy="13.45" r="4.47"></circle>
                                <path class="clr-i-solid clr-i-solid-path-6" d="M18.11,20.3A9.69,9.69,0,0,0,11,23l-.25.28v6.33a1.57,1.57,0,0,0,1.6,1.54H23.84a1.57,1.57,0,0,0,1.6-1.54V23.3L25.2,23A9.58,9.58,0,0,0,18.11,20.3Z"></path>
                            </g>
                        </svg>

                        <strong className="bold">
                            30
                        </strong>
                    </span>
                </div>
            </div>
            <button class="card-details">
                <p><Link to="/detalhes_eventos">Ver detalhes</Link></p>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M7 10L12 15L17 10" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>
        </div>
    );
};

export default Card;