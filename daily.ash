
void getVolcoino() {
  if (!get_property("_infernoDiscoVisited").to_boolean()
  && (get_property("_hotAirportToday").to_boolean()
  || get_property("hotAirportAlways").to_boolean())) {
    cli_execute("checkpoint");
    if (maximize("disco style 6 min" , false )) {
      print("Grabbing Volcoino from Inferno Disco.", "blue");	
      visit_url( "place.php?whichplace=airport_hot&action=airport4_zone1" );
      run_choice( 7 );
    } else {
      print("Not enough disco style to get Volcoino.", "red");
    }
    outfit("checkpoint");
  } else {
    print("Volcano visited today.", "red");
  }
}

void main() {
    boolean i = true;
    getVolcoino();
    i = cli_execute("create 1 crystal skull");
    i = cli_execute("create 1 crystal skull");
    i = cli_execute("create 1 crystal skull");
    i = cli_execute("daycare item");
    i = cli_execute("Briefcase collect");
    i = cli_execute("terminal extrude booze");
    i = cli_execute("terminal extrude booze");
    i = cli_execute("terminal extrude booze");
    i = cli_execute("cheat ancestral recall");
    i = cli_execute("cheat 1952 mickey mantle");
    i = cli_execute("cheat island");
    i = cli_execute("teatree shake");
    i = cli_execute("breakfast");
    i = cli_execute("FarFuture booze");
    i = cli_execute("numberology 69");
    i = cli_execute("numberology 69");
    i = cli_execute("fortune CheeseFax pizza foo thick");
    wait(5);
    i = cli_execute("fortune CheeseFax pizza foo thick");
    wait(5);
    i = cli_execute("fortune CheeseFax pizza foo thick");
    print("Dailies done");
}
