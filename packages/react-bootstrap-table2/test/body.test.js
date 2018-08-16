import 'jsdom-global/register';
import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';

import Body from '../src/body';
import Row from '../src/row';
import RowAggregator from '../src/row-aggregator';
import Const from '../src/const';
import RowSection from '../src/row-section';
import SelectionContext from '../src/contexts/selection-context';
import mockBodyResolvedProps from './test-helpers/mock/body-resolved-props';

describe('Body', () => {
  let wrapper;
  const columns = [{
    dataField: 'id',
    text: 'ID'
  }, {
    dataField: 'name',
    text: 'Name'
  }];

  const data = [{
    id: 1,
    name: 'A'
  }, {
    id: 2,
    name: 'B'
  }];

  const keyField = 'id';

  describe('simplest body', () => {
    beforeEach(() => {
      wrapper = shallow(<Body { ...mockBodyResolvedProps } keyField="id" columns={ columns } data={ data } />);
    });

    it('should render successfully', () => {
      expect(wrapper.length).toBe(1);
      expect(wrapper.find('tbody').length).toBe(1);
      expect(wrapper.find(Row).length).toBe(data.length);
    });
  });

  describe('when data is empty', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Body
          { ...mockBodyResolvedProps }
          keyField="id"
          columns={ columns }
          data={ data }
          visibleColumnSize={ columns.length }
          isEmpty
        />);
    });

    it('should not render', () => {
      expect(wrapper.length).toBe(1);
      expect(wrapper.find('tbody').length).toBe(0);
      expect(wrapper.find(RowSection).length).toBe(0);
    });

    describe('when noDataIndication props is defined', () => {
      let emptyIndication;

      describe('and it is not a function', () => {
        beforeEach(() => {
          emptyIndication = 'Table is empty';
          wrapper = shallow(
            <Body
              { ...mockBodyResolvedProps }
              keyField="id"
              columns={ columns }
              data={ data }
              visibleColumnSize={ columns.length }
              noDataIndication={ emptyIndication }
              isEmpty
            />);
        });

        it('should render successfully', () => {
          expect(wrapper.length).toBe(1);
          expect(wrapper.find('tbody').length).toBe(1);
          expect(wrapper.find(RowSection).length).toBe(1);
          expect(wrapper.find(RowSection).prop('content')).toEqual(emptyIndication);
        });
      });

      describe('and it is a function', () => {
        const content = 'Table is empty';
        let emptyIndicationCallBack;

        beforeEach(() => {
          emptyIndicationCallBack = sinon.stub().returns(content);
          wrapper = shallow(
            <Body
              { ...mockBodyResolvedProps }
              keyField="id"
              columns={ columns }
              data={ data }
              visibleColumnSize={ columns.length }
              noDataIndication={ emptyIndicationCallBack }
              isEmpty
            />);
        });

        it('should render successfully', () => {
          expect(wrapper.length).toBe(1);
          expect(wrapper.find('tbody').length).toBe(1);
          expect(wrapper.find(RowSection).length).toBe(1);
          expect(wrapper.find(RowSection).prop('content')).toEqual(emptyIndication);
        });

        it('should call custom noDataIndication function correctly', () => {
          expect(emptyIndicationCallBack.callCount).toBe(1);
        });
      });
    });
  });

  describe('when rowStyle prop is defined', () => {
    const rowStyle = { backgroundColor: 'red', color: 'white' };

    describe('and it is a style object', () => {
      beforeEach(() => {
        wrapper = shallow(
          <Body
            { ...mockBodyResolvedProps }
            keyField="id"
            columns={ columns }
            data={ data }
            rowStyle={ rowStyle }
          />);
      });

      it('should rendering Row component with correct style', () => {
        const rows = wrapper.find(Row);
        rows.forEach((row) => {
          expect(row.props().style).toEqual(rowStyle);
        });
      });
    });

    describe('and it is a callback functoin', () => {
      const rowStyleCallBack = sinon.stub().returns(rowStyle);
      beforeEach(() => {
        wrapper = shallow(
          <Body
            { ...mockBodyResolvedProps }
            keyField="id"
            columns={ columns }
            data={ data }
            rowStyle={ rowStyleCallBack }
          />);
      });

      it('should calling rowStyle callBack correctly', () => {
        expect(rowStyleCallBack.callCount).toBe(data.length);
      });

      it('should calling rowStyle callBack with correct argument', () => {
        expect(rowStyleCallBack.firstCall.calledWith(data[0], 0)).toBeTruthy();
        expect(rowStyleCallBack.secondCall.calledWith(data[1], 1)).toBeTruthy();
      });

      it('should rendering Row component with correct style', () => {
        const rows = wrapper.find(Row);
        rows.forEach((row) => {
          expect(row.props().style).toEqual(rowStyle);
        });
      });
    });
  });

  describe('when rowClasses prop is defined', () => {
    const rowClasses = 'test-classe';

    describe('and it is a string', () => {
      beforeEach(() => {
        wrapper = shallow(
          <Body
            { ...mockBodyResolvedProps }
            keyField="id"
            columns={ columns }
            data={ data }
            rowClasses={ rowClasses }
          />);
      });

      it('should rendering Row component with correct className', () => {
        const rows = wrapper.find(Row);
        rows.forEach((row) => {
          expect(row.props().className).toEqual(rowClasses);
        });
      });
    });

    describe('and it is a callback function', () => {
      const rowClassesCallBack = sinon.stub().returns(rowClasses);

      beforeEach(() => {
        wrapper = shallow(
          <Body
            { ...mockBodyResolvedProps }
            keyField="id"
            columns={ columns }
            data={ data }
            rowClasses={ rowClassesCallBack }
          />);
      });

      it('should calling rowClasses callback correctly', () => {
        expect(rowClassesCallBack.callCount).toBe(data.length);
      });

      it('should calling rowClasses callback with correct argument', () => {
        expect(rowClassesCallBack.firstCall.calledWith(data[0], 0)).toBeTruthy();
        expect(rowClassesCallBack.secondCall.calledWith(data[1], 1)).toBeTruthy();
      });

      it('should rendering Row component with correct className', () => {
        const rows = wrapper.find(Row);
        rows.forEach((row) => {
          expect(row.props().className).toEqual(rowClasses);
        });
      });
    });
  });

  describe('when rowEvents prop is defined', () => {
    const rowEvents = { onClick: sinon.stub() };

    describe('and it is a string', () => {
      beforeEach(() => {
        wrapper = shallow(
          <Body
            { ...mockBodyResolvedProps }
            keyField="id"
            columns={ columns }
            data={ data }
            rowEvents={ rowEvents }
          />);
      });

      it('should rendering Row component with correct attrs prop', () => {
        const rows = wrapper.find(Row);
        rows.forEach((row) => {
          expect(row.props().attrs).toEqual(rowEvents);
        });
      });
    });
  });

  describe('when cellEdit.nonEditableRows props is defined', () => {
    const nonEditableRows = [data[1].id];
    const cellEdit = {
      mode: Const.CLICK_TO_CELL_EDIT,
      nonEditableRows
    };
    beforeEach(() => {
      wrapper = shallow(
        <Body
          { ...mockBodyResolvedProps }
          data={ data }
          columns={ columns }
          keyField={ keyField }
          cellEdit={ cellEdit }
        />
      );
    });

    it('should render Row component with correct editable prop', () => {
      expect(wrapper.length).toBe(1);
      const rows = wrapper.find(Row);
      for (let i = 0; i < rows.length; i += 1) {
        if (nonEditableRows.indexOf(rows.get(i).props.row[keyField]) > -1) {
          expect(rows.get(i).props.editable).toBeFalsy();
        } else {
          expect(rows.get(i).props.editable).toBeTruthy();
        }
      }
    });
  });

  describe('when selectRow.mode is ROW_SELECT_DISABLED (row was un-selectable)', () => {
    beforeEach(() => {
      wrapper = shallow(
        <Body
          { ...mockBodyResolvedProps }
          data={ data }
          columns={ columns }
          keyField={ keyField }
        />
      );
    });

    it('prop selectRowEnabled on Row Component should be undefined', () => {
      expect(wrapper.find(Row).get(0).props.selectRowEnabled).not.toBeDefined();
    });
  });

  describe('when selectRow.mode is defined correctly', () => {
    const selectRow = { mode: 'checkbox' };

    beforeEach(() => {
      wrapper = mount(
        <SelectionContext.Provider data={ data } keyField={ keyField } selectRow={ selectRow }>
          <Body
            { ...mockBodyResolvedProps }
            data={ data }
            columns={ columns }
            keyField={ keyField }
            selectRow={ selectRow }
          />
        </SelectionContext.Provider>
      );
    });

    it('prop selectRowEnabled on RowAggregator Component should be defined', () => {
      expect(wrapper.find(RowAggregator).get(0).props.selectRowEnabled).toBeTruthy();
    });
  });
});
