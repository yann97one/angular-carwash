import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jspdf from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Prestation } from '../api-service.service';


interface Data {
  nom: string;
  prenom: string;
  adresse: string;
  tel: string;
  mail: string;
  prestation: Prestation | any;
}


@Component({
  selector: 'app-devis',
  templateUrl: './devis.component.html',
  styleUrls: ['./devis.component.scss']
})
export class DevisComponent implements OnInit, AfterViewInit {
  @Output() selected = new EventEmitter<string>();
  showPrestation!: string
  url = "http://testphp/API/api_devis_angular/api_presta.php";
  urlProduit = "http://testphp/API/api_devis_angular/api_produit.php";
  presta_tab: Prestation[] = [];
  product_tab: Prestation[] = [];
  data_tab: Data[] = [];
  option!: string;

  selectedPrestation: Prestation[] = [];
  //---------------------VARIABLE DU FORMULAIRE--------------------------------
  nom!: string;
  prenom!: string;
  adresse!: string;
  tel!: string;
  mail!: string;
  clientPresta!: Prestation;
  prestaId!: string;
  clientProduct!: Prestation;
  quantity!: number;

  //-----------------------------------------------------

  
  constructor(private _http: HttpClient) { }

  ngOnInit(): void {}

  /**
   * Méthode native d'Angular qui permet d'executer le code qui est à l'intérieur
   * dès que la vue est entièrement chargée
   */
  ngAfterViewInit(): void {
    //Appel à l'api
    const presta = this._http.get<Prestation[]>(this.url, { responseType: "json", withCredentials: true });
    const product = this._http.get<Prestation[]>(this.urlProduit, { responseType: "json", withCredentials: true, });
    presta.subscribe(data => {
      this.presta_tab = data;
      console.log(this.presta_tab)
      console.log(this.presta_tab);
    })
    product.subscribe(productData => {
      this.product_tab = productData;
      console.log(this.product_tab);
    })

    // this.api.getPresta(this.callBack);
    // this.api.getProducts(this.callBackProduct);
  }

  /**
   * 
   * @param event correspond à l'evenement lorsque l'utilisateur selectionne une prestation dans la liste déroulante
   */
  onPrestaSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selected = target.value;

    const prestaId = this.presta_tab.find(presta => selected == presta.id);

    if (prestaId) {
      this.clientPresta = prestaId;
    }
    // if (this.presta_tab != null && this.presta_tab != undefined) {
    //   const selectedPresta = this.presta_tab.find(presta => selected && selected == presta.id);
    //   if (selectedPresta) {
    //     this.clientPresta.push(selectedPresta);
    //   }
    // }
    console.log(this.clientPresta);
  }

  /**
   * 
   * @param event correspond à l'evenement lorsque l'utilisateur selectionne un produit dans la liste déroulante
   */
  onProductSelected(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selected = target.value;

    const productId = this.product_tab.find(product => selected == product.id);

    if (productId) {
      this.clientProduct = productId;
    }

    console.log(this.clientProduct);
  }




/**
 * 
 * @returns Retourne vrai si tout les champs sont remplis
 */
  verifField(): Boolean {
    if(this.option === "Choisir votre produit"){
      return false;
    }
    if(this.option === "Prestations"){
      if (typeof this.nom && this.prenom && this.adresse && this.tel && this.mail && this.clientPresta != null) {
        return true
      }
    }else if(typeof this.nom && this.prenom && this.adresse && this.tel && this.mail && this.clientProduct != null)
          return true
    return false
  }

  /**
   * Methode qui permet de générer un pdf à partir des informations du formulaire
   */
  downLoadPDF() {
    if (this.option === "Prestations") {
      console.log("dowloading pdf...");
      const doc = new jspdf('p', 'mm', 'a4');

      //data tab correspond aux infos qu'il y aura dans le pdf
      const data: Data = {
        "nom": this.nom,
        "adresse": this.adresse,
        "mail": this.mail,
        "prenom": this.prenom,
        "tel": this.tel,
        "prestation": this.clientPresta
      };



      const columns = ["Nom", "Caractéristiques", "Temps estimé", "Quantité"];
      const rows = [];



      const prixHT = this.quantity * Number(this.clientPresta.prix);
      const tva = prixHT * 0.2;
      const prixTTC = prixHT + tva;
      const prestaArr = [data.nom, this.clientPresta.caracteristique, this.clientPresta.description, this.quantity];
      rows.push(prestaArr);
      /////////////////// FORMATAGE DU PDF//////////////////////////
      //Ajouter le nom du client dans le pdf
      const pageWidth = doc.internal.pageSize.width;
      const title = "Devis";
      const titleWidth = doc.getTextDimensions(title).w;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 10);
      const clientText = "Facturé à " + data.nom + "  " + data.prenom;
      const clientTextWidth = doc.getTextDimensions(clientText).w;
      const clientTextX = (pageWidth - clientTextWidth) / 2;
      doc.text(clientText, clientTextX, 20);




      const tableY = 50;

      autoTable(doc, {
        startY: tableY,
        margin: { top: tableY },
        head: [columns],
        body: rows,
        theme: "grid",
        tableWidth: "auto",
        styles: {
          halign: "center",
          valign: "middle",
        },

      })

      //////// tableau pour la tva /////////////
      // options pour le tableau
      const tableOptions = {
        startY: doc.internal.pageSize.height - 50, // position en bas de page
        margin: { top: 20, right: 20 },
        styles: { fontSize: 10 },
      };

      // données pour le tableau
      const tableData = [
        ["Total HT", Number(prixHT).toFixed(2) + "€"],
        ["TVA (20%)", Number(tva).toFixed(2) + "€"],
        ["Total TTC", Number(prixTTC).toFixed(2) + "€"],
      ];
      autoTable(doc, {
        head: [["", ""]],
        body: tableData,
        columnStyles: { 4: { cellWidth: 30 } },

      });

      doc.setFontSize(12);
      doc.text("Nom : " + data.nom, 20, 150);
      doc.text("Prénom : " + data.prenom, 20, 160);
      doc.text("Adresse : " + data.adresse, 20, 170);
      doc.text("Téléphone : " + data.tel, 20, 180);
      doc.text("Mail : " + data.mail, 20, 190);
      // doc.text("Adresse : " + data.adresse, 20, doc.internal.pageSize.height - 90);
      // doc.text("Téléphone : " + data.tel, 20, doc.internal.pageSize.height - 80);

      doc.save("devis" + data.nom + data.prenom + ".pdf");
    } else {
      ////////////////////////////PRODUITS////////////////////////////
      console.log("dowloading pdf...");
      const doc = new jspdf('p', 'mm', 'a4');

      //data tab correspond aux infos qu'il y aura dans le pdf
      const data: Data = {
        "nom": this.nom,
        "adresse": this.adresse,
        "mail": this.mail,
        "prenom": this.prenom,
        "tel": this.tel,
        "prestation": this.clientProduct
      };



      const columns = ["Nom", "Description", "Quantité"];
      const rows = [];



      const prixHT = this.quantity * Number(this.clientProduct.prix);
      const tva = prixHT * 0.2;
      const prixTTC = prixHT + tva;
      const prestaArr = [this.clientProduct.nom, this.clientProduct.caracteristique, this.quantity];
      rows.push(prestaArr);
      /////////////////// FORMATAGE DU PDF//////////////////////////
      //Ajouter le nom du client dans le pdf
      const pageWidth = doc.internal.pageSize.width;
      const title = "Devis";
      const titleWidth = doc.getTextDimensions(title).w;
      const titleX = (pageWidth - titleWidth) / 2;
      doc.text(title, titleX, 10);
      const clientText = "Facturé à " + data.nom + "  " + data.prenom;
      const clientTextWidth = doc.getTextDimensions(clientText).w;
      const clientTextX = (pageWidth - clientTextWidth) / 2;
      doc.text(clientText, clientTextX, 20);




      const tableY = 50;

      autoTable(doc, {
        startY: tableY,
        margin: { top: tableY },
        head: [columns],
        body: rows,
        theme: "grid",
        tableWidth: "auto",
        styles: {
          halign: "center",
          valign: "middle",
        },

      })



      // données pour le tableau
      const tableData = [
        ["Total HT", Number(prixHT).toFixed(2) + "€"],
        ["TVA (20%)", Number(tva).toFixed(2) + "€"],
        ["Total TTC", Number(prixTTC).toFixed(2) + "€"],
      ];

      autoTable(doc, {
        head: [["", ""]],
        body: tableData,
        columnStyles: { 4: { cellWidth: 30 } },

      });
      // doc.text("Adresse : " + data.adresse, 20, doc.internal.pageSize.height - 90);
      // doc.text("Téléphone : " + data.tel, 20, doc.internal.pageSize.height - 80);
      doc.setFontSize(12);
      
      doc.text("Adresse : " + data.adresse, 20, 150);
      doc.text("Téléphone : " + data.tel, 20, 160);
      doc.text("Mail : " + data.mail, 20, 170);
      doc.save("devis" + data.nom + data.prenom + ".pdf");

    }



  }

  /**
   * Méthode qui vérifie si on à choisi prestation ou produit dans la 1ère liste déroulante
   */
  onOptionSelected() {
    
    switch (this.option) {
      case "Prestations":
        this.showPrestation = "presta"
        break;
      case "Produits":
        this.showPrestation = "product"
        break;

    }


  }

  /**
   * 
   * @returns retourne true si le regex est respecté
   */
  verifMail(): Boolean {
    const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$");
    if (regex.test(this.mail)) {
      return true
    } else
      return false
  }






}
