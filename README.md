# :robot: PRAISE

This repository contains the prototype implementation of the project described in the [paper](https://dl.acm.org/doi/abs/10.1145/3715852).

> Gargioni, Luigi and Fogli, Daniela and Baroni, Pietro.  
> "Preparation of Personalized Medicines through Collaborative Robots: A Hybrid Approach to the End-User Development of Robot Programs"  
> *ACM Journal on Responsible Computing*, 2025.  
> Publisher: ACM New York, NY.  

## Citation

If you use this project in your research, please cite the following paper:

```bibtex
@article{gargioni2025preparation,
  title={Preparation of Personalized Medicines through Collaborative Robots: A Hybrid Approach to the End-User Development of Robot Programs},
  author={Gargioni, Luigi and Fogli, Daniela and Baroni, Pietro},
  journal={ACM Journal on Responsible Computing},
  year={2025},
  publisher={ACM New York, NY}
}
```

## [Pharmaceutical Robotic and AI System for End users](https://dl.acm.org/doi/abs/10.1145/3715852)

The research reported in this paper proposes a new approach to collaborative robots that aims at improving the simplicity and efficiency of the programming task for non-technical users. It is grounded on three standpoints: (i) an elementary and disciplined paradigm for robot programming, called the simple programming journey, (ii) a hybrid interaction mode where robot tasks can be programmed using a natural language chat and, if necessary, can be completed and finalized through a block-based interface, and (iii) a robust cognitive match between the mental models of the user and the programming interface. The proposed approach has been implemented and tested through the development of a prototype programming environment called PRAISE, which can be tailored to different application domains through the definition of objects, locations, and actions. PRAISE has been tested by real users with a COBOTTA robot by DENSO WAVE Ltd. Two experimental tests have been carried out in order to validate the novel approach proposed and to assess its impact on end-user programming. The results obtained show that a hybrid approach exploiting both natural language dialogue and block-based interaction can help make the programming task easy and efficient for non-technical users.

---

## :gear: BackEnd

* Default Port: ```8000```

---

### :dart: Requirements

* [Python 3.11.x](https://www.python.org/downloads/)
* [Poetry](https://python-poetry.org/docs/#installation) (pip installation is not the official one, but the easiest)

---

### :star2: Installing from scratch

```bash
poetry install
```

---

### :wrench: Start server

```bash
poetry run start
```

---

### :arrows_counterclockwise: Update dependencies

Update with versions from `pyproject.toml`:

```bash
poetry update
```

\
Update `pyproject.toml` with latest versions retrieved from internet:

```bash
poetry run poetryup
```

---

## :dizzy: FrontEnd

* Folder: ```src```

---

### :books: Design libraries

* [React 18.x.x](https://it.reactjs.org/)
* [Parcel](https://parceljs.org/)
* [Ant Design](https://ant.design/)

---

### :open_file_folder: Install dependencies

```bash
npm install
```

---

### :twisted_rightwards_arrows: Update dependencies in package.json

* Visual Studio Code Exstension: [Versions Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)

---

### :mag_right: Start debug server

```bash
npm start
```

## :key: Credentials

* Username: `operator1`  
Password: `Operator_1!`  
Type: `Operator`  

* Username: `manager1`  
Password: `passwordmanager1`  
Type: `Manager`  

* Username: `admin`  
Password: `adminpassword`  
Type: `Administrator`/`Manager`
