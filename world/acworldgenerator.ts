import { ACTerrainType } from './actown';
import { ACWorld } from './acworld';
import { ACItem, ACItemTypes } from './acitem';
import { ACTree } from "./actee";
export class ACWorldGenerator {

    private world: ACWorld = null;

    private readonly maxTiles = 256;
    private readonly maxCols = 16;
    private readonly maxRows = 16;


    constructor(world:ACWorld) {
        this.world = world;
    }

    public generate() {
        let acres = [
            "A1", "A2", "A3", "A4", "A5",
            "B1", "B2", "B3", "B4", "B5",
            "C1", "C2", "C3", "C4", "C5",
            "D1", "D2", "D3", "D4", "D5",
            "E1", "E2", "E3", "E4", "E5",
            "F1", "F2", "F3", "F4", "F5"
        ];

        let buildingAcres: any = {};


        buildingAcres["nook"] = this.getNookAcre(acres);
        buildingAcres["player"] = "B3";

        for (let i in acres) {
            let acre = acres[i];
            this.generateAcre(acre);
            this.generateTrees(acre);
            this.generateRocks(acre);
            this.addBuildings(acre, buildingAcres);
        }

    }

    private getNookAcre(acres: any) {
        let acre: string = "";

        while (acre != "A1" && acre.charAt(0) != 'F' && acre != "B3") {
            acre = acres[Math.floor(Math.random() * acres.length)];
        }

        return acre;
    }

    private generateAcre(acre: string) {
        for (let i = 0; i < this.maxTiles - 1; i++) {

            this.world.Town.MapItems[acre] = new Array(256);
            this.world.Town.MapItems[acre].fill(null, 0, 256);

            this.world.Town.MapNPC[acre] = new Array(256);
            this.world.Town.MapItems[acre].fill(null, 0, 256);


            this.world.Town.MapTerrian[acre] = new Array(256);

            if (acre.charAt(0) == 'F') {
                this.world.Town.MapTerrian[acre] = [
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass, ACTerrainType.Grass,
                    ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach,
                    ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach, ACTerrainType.Beach,
                    ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River,
                    ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River, ACTerrainType.River,
                ]
            }

            else {
                this.world.Town.MapTerrian[acre].fill(ACTerrainType.Grass, 0, 256);
            }
        }

    }

    private generateTrees(acre: string) {
        let minSpawnRatio = 25;
        let maxSpawnRatio = 40;
        
        //Generate fruit trees...



        for (let i = 0; i < this.maxTiles; i++) {

            let spawnRatio = Math.floor(Math.random() * (minSpawnRatio - maxSpawnRatio + 1)) + minSpawnRatio;
            
            if (i % spawnRatio === 0 && i % this.maxCols != 0) {
                if(this.world.Town.MapTerrian[acre][i] != ACTerrainType.Beach && this.world.Town.MapTerrian[acre][i] != ACTerrainType.River) {
                    let treeItem = new ACTree();
                    this.world.Town.MapItems[acre][i] = treeItem;
                }

            }
        }

    }

    private generateRocks(acre:string) {
                
        let minSpawnRatio = 25;
        let maxSpawnRatio = 40;

        let spawnRatio = Math.floor(Math.random() * (minSpawnRatio - maxSpawnRatio + 1)) + minSpawnRatio;


        for (let i = 0; i < this.maxTiles; i++) {    
            if (i % spawnRatio === 0 && i % this.maxCols != 0) {
                if(this.world.Town.MapTerrian[acre][i] != ACTerrainType.Beach && this.world.Town.MapTerrian[acre][i] != ACTerrainType.River) {
                    let rockItem = new ACItem();
                    rockItem.Type = ACItemTypes.Rock;
                    this.world.Town.MapItems[acre][i] = rockItem;

                    //we only want one rock per acre
                    break;
                }

            }
        }
    }

    private addBuildings(acre: string, buildingAcres: any) {

        switch (acre) {
            case buildingAcres["nook"]:
                let item = new ACItem();
                item.Name = "Nooks Cranny";
                item.Type = ACItemTypes.Nooks;

                //always in the corner
                this.world.Town.MapItems[acre][this.maxCols - 2] = item;
                break;

            case buildingAcres["player"]:
                let halfPoint: number = ((this.maxCols / 2) * this.maxRows) + this.maxRows /2;

                let houseItem = new ACItem();
                houseItem.Type = ACItemTypes.House;

                this.world.Town.MapItems[acre][halfPoint - 1] = houseItem;

                let bbs: ACItem = new ACItem();
                bbs.Type = ACItemTypes.BBS;

                this.world.Town.MapItems[acre][halfPoint - this.maxCols] = bbs;
                break;

        }
    }


}