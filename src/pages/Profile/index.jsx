import axios from "axios";
import { format } from "date-fns";
import { formatISO } from "date-fns/esm";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAsyncFn, useLocalStorage } from "react-use";

import { Card, DateSelect, Icon } from "~/components";
											 

export function Profile() {
  const params = useParams();
								  

  const navigate = useNavigate();
													   
																				   
								 
						  
												  
									   
		  

  const [currentDate, setCurrentDate] = useState(
    formatISO(new Date(2022, 10, 20))
  );
			  

  const [auth, setAuth] = useLocalStorage("auth", {});
						
				   
		 
	  

  const [{ value: user, loading, error }, fetchHunches] = useAsyncFn(
    async () => {
      const response = await axios({
        method: "get",
        baseURL: import.meta.env.VITE_API_URL,
						  
        url: `/${params.username}`,
      });

	  
      const hunches = response.data.hunches.reduce((accumulator, hunch) => {
        accumulator[hunch.gameId] = hunch;

        return accumulator;
      }, {});

      return {
        ...response.data,
        hunches,
      };
    }
  );

  const [games, fetchGames] = useAsyncFn(async (params) => {
    const response = await axios({
      method: "get",
      baseURL: import.meta.env.VITE_API_URL,
      url: "/games",
      params: params,
    });

    return response.data;
  });
		  

  function logout() {
    setAuth({});

    navigate("/login");
  }

  const isLoading = games.loading || loading;
  const hasError = games.error || error;
  const isDone = !isLoading && !hasError;

  useEffect(() => {
    fetchHunches();
  }, []);
																			  
																								  
									  
																		  
							
							
					  
					 

  useEffect(() => {
    fetchGames({ gameTime: currentDate });
  }, [currentDate]);
											 
																 
							

  return (
    <>
      <header className="bg-red-500 text-white">
        <div className="container max-w-3xl flex justify-between p-4">
          <img
            src="/imgs/logo-fundo-vermelho.svg"
            alt="Logo do Na Trave"
            className="w-28 md:w-40"
          />

          {auth?.user?.id && (
            <div onClick={logout} className="p-2 cursor-pointer">
              Sair
            </div>
          )}
        </div>
      </header>

      <main className="space-y-6">
        <section id="header" className="bg-red-500 text-white">
          <div className="container max-w-3xl space-y-2 p-4">
            <a href="/dashboard">
              <Icon name="back" className="w-10" />
            </a>

            <h3 className="text-2xl font-bold">{user?.name}</h3>
          </div>
        </section>

        <section id="content" className="container max-w-3xl p-4 space-y-4">
          <h2 className="text-red-500 text-xl font-bold">Seus palpites</h2>

          <DateSelect currentDate={currentDate} onChange={setCurrentDate} />
															
															   

          <div className="space-y-4">
            {isLoading && "Carregando jogos..."}
											 
												
														
														
																				   
																							  
																							  
											   
							  
			
            {hasError && "Ops! Algo deu errado."}
				   

            {isDone &&
              games.value?.map((game) => (
                <Card
                  key={game.id}
                  gameId={game.id}
                  homeTeam={game.homeTeam}
                  awayTeam={game.awayTeam}
                  gameTime={format(new Date(game.gameTime), "H:mm")}
                  homeTeamScore={user?.hunches?.[game.id]?.homeTeamScore || ""}
                  awayTeamScore={user?.hunches?.[game.id]?.awayTeamScore || ""}
                  disabled={true}
                />
              ))}
          </div>
        </section>
      </main>
    </>
  );
}